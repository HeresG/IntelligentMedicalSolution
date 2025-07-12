/*
  Warnings:

  - You are about to drop the `Informatii_Categorie_Boala` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Informatii_Categorie_Boala" DROP CONSTRAINT "Informatii_Categorie_Boala_imageId_fkey";

-- DropTable
DROP TABLE "Informatii_Categorie_Boala";

-- CreateTable
CREATE TABLE "Article" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "description" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "imageId" INTEGER,
    "uploadedById" INTEGER NOT NULL,

    CONSTRAINT "Article_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Article_name_key" ON "Article"("name");

-- AddForeignKey
ALTER TABLE "Article" ADD CONSTRAINT "Article_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "FileS3"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Article" ADD CONSTRAINT "Article_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
