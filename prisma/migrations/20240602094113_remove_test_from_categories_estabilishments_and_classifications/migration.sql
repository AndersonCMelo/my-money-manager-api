/*
  Warnings:

  - You are about to drop the column `test` on the `categories` table. All the data in the column will be lost.
  - You are about to drop the column `test` on the `classifications` table. All the data in the column will be lost.
  - You are about to drop the column `test` on the `estabilishments` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "categories" DROP COLUMN "test";

-- AlterTable
ALTER TABLE "classifications" DROP COLUMN "test";

-- AlterTable
ALTER TABLE "estabilishments" DROP COLUMN "test";
