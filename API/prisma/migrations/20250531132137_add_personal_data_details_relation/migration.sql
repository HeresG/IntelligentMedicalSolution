-- CreateTable
CREATE TABLE "Personal_Data_Details" (
    "id" SERIAL NOT NULL,
    "fumator" BOOLEAN NOT NULL,
    "sarcinaActiva" BOOLEAN NOT NULL,
    "diabet" BOOLEAN NOT NULL,
    "personalDataId" INTEGER NOT NULL,

    CONSTRAINT "Personal_Data_Details_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Personal_Data_Details_personalDataId_key" ON "Personal_Data_Details"("personalDataId");

-- AddForeignKey
ALTER TABLE "Personal_Data_Details" ADD CONSTRAINT "Personal_Data_Details_personalDataId_fkey" FOREIGN KEY ("personalDataId") REFERENCES "Personal_Data"("id") ON DELETE CASCADE ON UPDATE CASCADE;
