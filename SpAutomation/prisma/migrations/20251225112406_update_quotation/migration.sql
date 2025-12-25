/*
  Warnings:

  - Added the required column `OID` to the `Invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `company` to the `Quotation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `taxId` to the `Quotation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Invoice" ADD COLUMN     "OID" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Quotation" ADD COLUMN     "company" TEXT NOT NULL,
ADD COLUMN     "taxId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Reciept" (
    "id" SERIAL NOT NULL,
    "IID" TEXT NOT NULL,
    "RID" TEXT NOT NULL,
    "MID" TEXT NOT NULL,
    "subject" TEXT NOT NULL,

    CONSTRAINT "Reciept_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GmailToken" (
    "id" SERIAL NOT NULL,
    "accessToken" TEXT NOT NULL,
    "refreshToken" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GmailToken_pkey" PRIMARY KEY ("id")
);
