/*
  Warnings:

  - You are about to drop the column `created_at` on the `categories` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `estabilishments` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `settings` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `settings` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "categories" DROP COLUMN "created_at";

-- AlterTable
ALTER TABLE "estabilishments" DROP COLUMN "created_at";

-- AlterTable
ALTER TABLE "settings" DROP COLUMN "created_at",
DROP COLUMN "updated_at";
