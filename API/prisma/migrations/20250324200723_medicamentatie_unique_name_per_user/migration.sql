/*
  Warnings:

  - A unique constraint covering the columns `[name,userId]` on the table `Medicamentatie` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Medicamentatie_name_key";

-- CreateIndex
CREATE UNIQUE INDEX "Medicamentatie_name_userId_key" ON "Medicamentatie"("name", "userId");
