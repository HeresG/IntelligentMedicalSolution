-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'CLIENT', 'DOCTOR');

-- CreateEnum
CREATE TYPE "Analyze_Jornul_Type" AS ENUM ('ACTIV', 'RETRO');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'CLIENT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Personal_Data" (
    "id" SERIAL NOT NULL,
    "cnp" VARCHAR(13) NOT NULL,
    "firstName" VARCHAR(40) NOT NULL,
    "lastName" VARCHAR(40) NOT NULL,
    "address" VARCHAR(200) NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Personal_Data_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Informatii_Categorie_Boala" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "description" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "imageId" INTEGER,

    CONSTRAINT "Informatii_Categorie_Boala_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FileS3" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "uploaderId" INTEGER NOT NULL,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT,
    "mimeType" TEXT NOT NULL,

    CONSTRAINT "FileS3_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Medicament" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "Medicament_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Medicamentatie" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(64) NOT NULL,
    "startDate" TIMESTAMP NOT NULL,
    "endDate" TIMESTAMP NOT NULL,
    "medicamentId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Medicamentatie_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Personal_Data_cnp_key" ON "Personal_Data"("cnp");

-- CreateIndex
CREATE UNIQUE INDEX "Personal_Data_userId_key" ON "Personal_Data"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Informatii_Categorie_Boala_name_key" ON "Informatii_Categorie_Boala"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Informatii_Categorie_Boala_imageId_key" ON "Informatii_Categorie_Boala"("imageId");

-- CreateIndex
CREATE UNIQUE INDEX "Medicament_name_key" ON "Medicament"("name");

-- AddForeignKey
ALTER TABLE "Personal_Data" ADD CONSTRAINT "Personal_Data_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Informatii_Categorie_Boala" ADD CONSTRAINT "Informatii_Categorie_Boala_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "FileS3"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FileS3" ADD CONSTRAINT "FileS3_uploaderId_fkey" FOREIGN KEY ("uploaderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Medicamentatie" ADD CONSTRAINT "Medicamentatie_medicamentId_fkey" FOREIGN KEY ("medicamentId") REFERENCES "Medicament"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Medicamentatie" ADD CONSTRAINT "Medicamentatie_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
