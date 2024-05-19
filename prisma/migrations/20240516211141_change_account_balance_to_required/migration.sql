/*
  Warnings:

  - Made the column `accountBalance` on table `bank_accounts` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "bank_accounts" ALTER COLUMN "accountBalance" SET NOT NULL;
