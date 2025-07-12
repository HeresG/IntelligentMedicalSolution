-- CreateTable
CREATE TABLE "Medical_Analyze_ML_Result" (
    "id" SERIAL NOT NULL,
    "resultName" TEXT NOT NULL,
    "confirmed" BOOLEAN NOT NULL DEFAULT false,
    "analyzeId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Medical_Analyze_ML_Result_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Medical_Analyze_ML_Result" ADD CONSTRAINT "Medical_Analyze_ML_Result_analyzeId_fkey" FOREIGN KEY ("analyzeId") REFERENCES "Medical_Analyze"("id") ON DELETE CASCADE ON UPDATE CASCADE;
