/*
  Warnings:

  - You are about to drop the column `extra` on the `categories` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "categories" DROP COLUMN "extra",
ALTER COLUMN "order" SET DATA TYPE TEXT;
