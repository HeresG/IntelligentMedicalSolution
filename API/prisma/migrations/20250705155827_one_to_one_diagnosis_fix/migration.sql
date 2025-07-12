-- CreateTable
CREATE TABLE "Medical_Analyze_Diagnosis" (
    "id" SERIAL NOT NULL,
    "doctorNote" TEXT NOT NULL,
    "analyzeId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Medical_Analyze_Diagnosis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Diagnosis_ML_Diagnosis_Map" (
    "id" SERIAL NOT NULL,
    "diagnosisId" INTEGER NOT NULL,
    "mlResultId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Diagnosis_ML_Diagnosis_Map_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Medical_Analyze_Diagnosis_analyzeId_key" ON "Medical_Analyze_Diagnosis"("analyzeId");

-- CreateIndex
CREATE UNIQUE INDEX "Diagnosis_ML_Diagnosis_Map_diagnosisId_mlResultId_key" ON "Diagnosis_ML_Diagnosis_Map"("diagnosisId", "mlResultId");

-- AddForeignKey
ALTER TABLE "Medical_Analyze_Diagnosis" ADD CONSTRAINT "Medical_Analyze_Diagnosis_analyzeId_fkey" FOREIGN KEY ("analyzeId") REFERENCES "Medical_Analyze"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Diagnosis_ML_Diagnosis_Map" ADD CONSTRAINT "Diagnosis_ML_Diagnosis_Map_diagnosisId_fkey" FOREIGN KEY ("diagnosisId") REFERENCES "Medical_Analyze_Diagnosis"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Diagnosis_ML_Diagnosis_Map" ADD CONSTRAINT "Diagnosis_ML_Diagnosis_Map_mlResultId_fkey" FOREIGN KEY ("mlResultId") REFERENCES "Medical_Analyze_ML_Result"("id") ON DELETE CASCADE ON UPDATE CASCADE;
