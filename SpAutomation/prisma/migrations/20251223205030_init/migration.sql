-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "taxId" TEXT NOT NULL,
    "emails" TEXT[],

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Quotation" (
    "id" SERIAL NOT NULL,
    "QID" TEXT NOT NULL,
    "MID" TEXT NOT NULL,
    "subject" TEXT NOT NULL,

    CONSTRAINT "Quotation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Invoice" (
    "id" SERIAL NOT NULL,
    "IID" TEXT NOT NULL,
    "MID" TEXT NOT NULL,
    "subject" TEXT NOT NULL,

    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_taxId_key" ON "User"("taxId");

-- CreateIndex
CREATE UNIQUE INDEX "Quotation_QID_key" ON "Quotation"("QID");
