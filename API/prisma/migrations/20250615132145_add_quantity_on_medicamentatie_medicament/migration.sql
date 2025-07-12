/*
  Warnings:

  - Added the required column `quantity` to the `Medicamentatie_Medicamente` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Medicamentatie_Medicamente" ADD COLUMN     "quantity" INTEGER NOT NULL;
