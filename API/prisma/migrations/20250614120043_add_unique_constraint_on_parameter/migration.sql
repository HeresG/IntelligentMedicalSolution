/*
  Warnings:

  - You are about to drop the `Medical_Disease_Category` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Medical_Disease" DROP CONSTRAINT "Medical_Disease_categoryId_fkey";

-- DropTable
DROP TABLE "Medical_Disease_Category";

-- CreateTable
CREATE TABLE "Medical_Category" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "Medical_Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Medical_Parameter" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "unit" VARCHAR(20) NOT NULL,
    "type" VARCHAR(50) NOT NULL,
    "min_val" DOUBLE PRECISION,
    "max_val" DOUBLE PRECISION,
    "medicalCategoryId" INTEGER NOT NULL,

    CONSTRAINT "Medical_Parameter_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Medical_Parameter_name_medicalCategoryId_key" ON "Medical_Parameter"("name", "medicalCategoryId");

-- AddForeignKey
ALTER TABLE "Medical_Disease" ADD CONSTRAINT "Medical_Disease_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Medical_Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Medical_Parameter" ADD CONSTRAINT "Medical_Parameter_medicalCategoryId_fkey" FOREIGN KEY ("medicalCategoryId") REFERENCES "Medical_Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;
