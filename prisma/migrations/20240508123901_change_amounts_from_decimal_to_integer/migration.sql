/*
  Warnings:

  - You are about to alter the column `openingBalance` on the `bank_accounts` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Integer`.
  - You are about to alter the column `accountBalance` on the `bank_accounts` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Integer`.
  - You are about to alter the column `amount` on the `transactions` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Integer`.

*/
-- AlterTable
ALTER TABLE "bank_accounts" ALTER COLUMN "openingBalance" SET DATA TYPE INTEGER,
ALTER COLUMN "accountBalance" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "transactions" ALTER COLUMN "amount" SET DATA TYPE INTEGER;
