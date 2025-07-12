/*
  Warnings:

  - You are about to drop the `Medicament` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[name]` on the table `Medicamentatie` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Medicamentatie" DROP CONSTRAINT "Medicamentatie_medicamentId_fkey";

-- DropTable
DROP TABLE "Medicament";

-- CreateTable
CREATE TABLE "Medicamente" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "Medicamente_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Medicamente_name_key" ON "Medicamente"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Medicamentatie_name_key" ON "Medicamentatie"("name");

-- AddForeignKey
ALTER TABLE "Medicamentatie" ADD CONSTRAINT "Medicamentatie_medicamentId_fkey" FOREIGN KEY ("medicamentId") REFERENCES "Medicamente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
