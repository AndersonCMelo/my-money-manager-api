-- AlterTable
ALTER TABLE "categories" ADD COLUMN     "test" INTEGER;

-- AlterTable
ALTER TABLE "estabilishments" ADD COLUMN     "test" TEXT;

-- AlterTable
ALTER TABLE "transactions" ADD COLUMN     "classificationId" TEXT;

-- CreateTable
CREATE TABLE "classifications" (
    "id" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "order" INTEGER,
    "color" TEXT NOT NULL,
    "test" INTEGER,

    CONSTRAINT "classifications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "transactions_classificationId_idx" ON "transactions"("classificationId");

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_classificationId_fkey" FOREIGN KEY ("classificationId") REFERENCES "classifications"("id") ON DELETE SET NULL ON UPDATE CASCADE;
