/*
  Warnings:

  - You are about to drop the column `file` on the `Medical_Analyze` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[fileId]` on the table `Medical_Analyze` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Medical_Analyze" DROP COLUMN "file",
ADD COLUMN     "fileId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Medical_Analyze_fileId_key" ON "Medical_Analyze"("fileId");

-- AddForeignKey
ALTER TABLE "Medical_Analyze" ADD CONSTRAINT "Medical_Analyze_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "FileS3"("id") ON DELETE CASCADE ON UPDATE CASCADE;
