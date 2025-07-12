
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { s3 } from '../config/s3bucket.js';
import { GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';

export const uploadBufferToS3 = async (buffer, originalname, mimetype) => {
  const extension = path.extname(originalname);
  const uniqueName = `${uuidv4()}${extension}`;
  const key = `medical-files/${uniqueName}`;

  const uploadParams = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: key,
    Body: buffer,
    ContentType: mimetype,
  };

  await s3.send(new PutObjectCommand(uploadParams));

  return {
    key,
    name: originalname,
    mimeType: mimetype,
  };
};


export const getS3FileStream = async (key) => {
  const command = new GetObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: key,
  });

  const data = await s3.send(command);

  if (!data.Body || typeof data.Body.pipe !== 'function') {
    throw new Error('Invalid S3 object stream');
  }

  return {
    stream: data.Body,
    contentLength: data.ContentLength,
    contentType: data.ContentType,
    lastModified: data.LastModified,
  };
};
