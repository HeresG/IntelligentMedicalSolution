-- CreateTable
CREATE TABLE "Medical_Disease_Category" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "Medical_Disease_Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Medical_Disease" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT NOT NULL,
    "categoryId" INTEGER NOT NULL,

    CONSTRAINT "Medical_Disease_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Medical_Diagnosis" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "medicalDiseaseId" INTEGER NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "isChronic" BOOLEAN NOT NULL,
    "diagnosisMethod" VARCHAR(100) NOT NULL,
    "confirmed" BOOLEAN NOT NULL,
    "confirmedDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Medical_Diagnosis_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Medical_Diagnosis_medicalDiseaseId_key" ON "Medical_Diagnosis"("medicalDiseaseId");

-- AddForeignKey
ALTER TABLE "Medical_Disease" ADD CONSTRAINT "Medical_Disease_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Medical_Disease_Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Medical_Diagnosis" ADD CONSTRAINT "Medical_Diagnosis_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Medical_Diagnosis" ADD CONSTRAINT "Medical_Diagnosis_medicalDiseaseId_fkey" FOREIGN KEY ("medicalDiseaseId") REFERENCES "Medical_Disease"("id") ON DELETE CASCADE ON UPDATE CASCADE;
