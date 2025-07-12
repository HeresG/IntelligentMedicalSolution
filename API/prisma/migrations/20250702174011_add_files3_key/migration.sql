/*
  Warnings:

  - Added the required column `key` to the `FileS3` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "FileS3" ADD COLUMN     "key" TEXT NOT NULL;
