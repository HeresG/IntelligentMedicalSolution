/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Medical_Category` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Medical_Category_name_key" ON "Medical_Category"("name");
