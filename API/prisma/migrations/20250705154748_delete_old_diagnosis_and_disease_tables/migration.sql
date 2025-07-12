/*
  Warnings:

  - You are about to drop the `Medical_Diagnosis` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Medical_Disease` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Medical_Diagnosis" DROP CONSTRAINT "Medical_Diagnosis_medicalDiseaseId_fkey";

-- DropForeignKey
ALTER TABLE "Medical_Diagnosis" DROP CONSTRAINT "Medical_Diagnosis_userId_fkey";

-- DropForeignKey
ALTER TABLE "Medical_Disease" DROP CONSTRAINT "Medical_Disease_categoryId_fkey";

-- DropTable
DROP TABLE "Medical_Diagnosis";

-- DropTable
DROP TABLE "Medical_Disease";
