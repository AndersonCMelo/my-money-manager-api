/*
  Warnings:

  - You are about to drop the column `classificationId` on the `transactions` table. All the data in the column will be lost.
  - You are about to drop the `classifications` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "transactions" DROP CONSTRAINT "transactions_classificationId_fkey";

-- DropIndex
DROP INDEX "transactions_classificationId_idx";

-- AlterTable
ALTER TABLE "transactions" DROP COLUMN "classificationId";

-- DropTable
DROP TABLE "classifications";
