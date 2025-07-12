/*
  Warnings:

  - You are about to drop the column `quantity` on the `Medicamentatie` table. All the data in the column will be lost.
  - Added the required column `quantity` to the `Medicamentatie_Medicamente` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Medicamentatie" DROP COLUMN "quantity";

-- AlterTable
ALTER TABLE "Medicamentatie_Medicamente" ADD COLUMN     "quantity" INTEGER NOT NULL;
