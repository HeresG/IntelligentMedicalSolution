-- CreateTable
CREATE TABLE "Medical_Analyze" (
    "id" SERIAL NOT NULL,
    "testingDate" TIMESTAMP(3),
    "analyzeTitle" TEXT NOT NULL,
    "institution" TEXT NOT NULL,
    "doctor" TEXT,
    "notes" TEXT,
    "file" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Medical_Analyze_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Medical_Analyze_Category" (
    "id" SERIAL NOT NULL,
    "analyzeId" INTEGER NOT NULL,
    "categoryId" INTEGER NOT NULL,

    CONSTRAINT "Medical_Analyze_Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Medical_Analyze_Result" (
    "id" SERIAL NOT NULL,
    "analyzeId" INTEGER NOT NULL,
    "parameterId" INTEGER NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Medical_Analyze_Result_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Medical_Analyze_Category_analyzeId_categoryId_key" ON "Medical_Analyze_Category"("analyzeId", "categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "Medical_Analyze_Result_analyzeId_parameterId_key" ON "Medical_Analyze_Result"("analyzeId", "parameterId");

-- AddForeignKey
ALTER TABLE "Medical_Analyze" ADD CONSTRAINT "Medical_Analyze_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Medical_Analyze_Category" ADD CONSTRAINT "Medical_Analyze_Category_analyzeId_fkey" FOREIGN KEY ("analyzeId") REFERENCES "Medical_Analyze"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Medical_Analyze_Category" ADD CONSTRAINT "Medical_Analyze_Category_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Medical_Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Medical_Analyze_Result" ADD CONSTRAINT "Medical_Analyze_Result_analyzeId_fkey" FOREIGN KEY ("analyzeId") REFERENCES "Medical_Analyze"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Medical_Analyze_Result" ADD CONSTRAINT "Medical_Analyze_Result_parameterId_fkey" FOREIGN KEY ("parameterId") REFERENCES "Medical_Parameter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
