/*
  Warnings:

  - A unique constraint covering the columns `[key]` on the table `FileS3` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "FileS3_key_key" ON "FileS3"("key");
