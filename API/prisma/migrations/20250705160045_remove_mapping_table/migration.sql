/*
  Warnings:

  - You are about to drop the `Diagnosis_ML_Diagnosis_Map` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Diagnosis_ML_Diagnosis_Map" DROP CONSTRAINT "Diagnosis_ML_Diagnosis_Map_diagnosisId_fkey";

-- DropForeignKey
ALTER TABLE "Diagnosis_ML_Diagnosis_Map" DROP CONSTRAINT "Diagnosis_ML_Diagnosis_Map_mlResultId_fkey";

-- DropTable
DROP TABLE "Diagnosis_ML_Diagnosis_Map";
