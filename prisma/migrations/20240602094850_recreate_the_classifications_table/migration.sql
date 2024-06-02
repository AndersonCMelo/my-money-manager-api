-- AlterTable
ALTER TABLE "transactions" ADD COLUMN     "classificationId" TEXT;

-- CreateTable
CREATE TABLE "classifications" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "order" INTEGER,
    "color" TEXT NOT NULL,

    CONSTRAINT "classifications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "transactions_classificationId_idx" ON "transactions"("classificationId");

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_classificationId_fkey" FOREIGN KEY ("classificationId") REFERENCES "classifications"("id") ON DELETE SET NULL ON UPDATE CASCADE;
