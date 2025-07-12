-- AlterTable
ALTER TABLE "Medical_Analyze" ADD COLUMN     "doctorId" INTEGER;

-- AddForeignKey
ALTER TABLE "Medical_Analyze" ADD CONSTRAINT "Medical_Analyze_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
