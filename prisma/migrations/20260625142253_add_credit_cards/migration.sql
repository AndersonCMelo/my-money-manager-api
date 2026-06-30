/*
  Warnings:

  - You are about to drop the column `classificationId` on the `transactions` table. All the data in the column will be lost.
  - You are about to drop the `classifications` table. If the table is not empty, all the data it contains will be lost.
  - Changed the type of `type` on the `transactions` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "TransactionsType" AS ENUM ('income', 'expense', 'transfer', 'credit_expense', 'credit_payment');

-- DropForeignKey
ALTER TABLE "transactions" DROP CONSTRAINT "transactions_classificationId_fkey";

-- DropIndex
DROP INDEX "transactions_classificationId_idx";

-- AlterTable
ALTER TABLE "transactions" DROP COLUMN "classificationId",
ADD COLUMN     "creditCardId" TEXT,
ADD COLUMN     "installmentGroupId" TEXT,
ADD COLUMN     "installmentNumber" INTEGER,
ADD COLUMN     "isPaid" BOOLEAN DEFAULT false,
ADD COLUMN     "totalInstallments" INTEGER,
DROP COLUMN "type",
ADD COLUMN     "type" "TransactionsType";

-- Backfill existing rows before applying NOT NULL
UPDATE "transactions" SET "type" = 'expense' WHERE "type" IS NULL;

-- Apply NOT NULL constraint after data is set
ALTER TABLE "transactions" ALTER COLUMN "type" SET NOT NULL;

-- DropTable
DROP TABLE "classifications";

-- CreateTable
CREATE TABLE "credit_cards" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "limit" INTEGER NOT NULL,
    "closingDay" INTEGER NOT NULL,
    "dueDay" INTEGER NOT NULL,
    "color" TEXT,
    "ownerId" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "credit_cards_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_creditCardId_fkey" FOREIGN KEY ("creditCardId") REFERENCES "credit_cards"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "credit_cards" ADD CONSTRAINT "credit_cards_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
