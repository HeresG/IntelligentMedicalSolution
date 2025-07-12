import prisma from "../config/databaseInstance.js";
import { getS3FileStream } from "../services/blobService.js";

export const getFileById = async (req, res) => {
  const { id } = req.params;

  try {
    const file = await prisma.fileS3.findUnique({
      where: { id: parseInt(id, 10) },
    });

    if (!file) {
      return res.status(404).json({ error: 'File not found in database' });
    }

    const { stream, contentType } = await getS3FileStream(file.key);

    res.setHeader('Content-Type', contentType || file.mimeType);
    res.setHeader('Content-Disposition', `attachment; filename="${file.name}"`);

    stream.pipe(res);
  } catch (error) {
    console.error('Error retrieving file from S3:', error);
    res.status(500).json({ error: 'Failed to retrieve file from S3' });
  }
};