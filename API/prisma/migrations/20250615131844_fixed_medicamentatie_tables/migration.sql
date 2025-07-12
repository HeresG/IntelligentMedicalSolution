/*
  Warnings:

  - You are about to drop the column `medicamentId` on the `Medicamentatie` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Medicamentatie" DROP CONSTRAINT "Medicamentatie_medicamentId_fkey";

-- AlterTable
ALTER TABLE "Medicamentatie" DROP COLUMN "medicamentId";

-- CreateTable
CREATE TABLE "Medicamentatie_Medicamente" (
    "id" SERIAL NOT NULL,
    "medicamentatieId" INTEGER NOT NULL,
    "medicamentId" INTEGER NOT NULL,

    CONSTRAINT "Medicamentatie_Medicamente_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Medicamentatie_Medicamente_medicamentatieId_medicamentId_key" ON "Medicamentatie_Medicamente"("medicamentatieId", "medicamentId");

-- AddForeignKey
ALTER TABLE "Medicamentatie_Medicamente" ADD CONSTRAINT "Medicamentatie_Medicamente_medicamentatieId_fkey" FOREIGN KEY ("medicamentatieId") REFERENCES "Medicamentatie"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Medicamentatie_Medicamente" ADD CONSTRAINT "Medicamentatie_Medicamente_medicamentId_fkey" FOREIGN KEY ("medicamentId") REFERENCES "Medicamente"("id") ON DELETE CASCADE ON UPDATE CASCADE;
