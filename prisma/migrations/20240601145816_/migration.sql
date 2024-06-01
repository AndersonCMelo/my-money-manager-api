/*
  Warnings:

  - The `order` column on the `categories` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "categories" DROP COLUMN "order",
ADD COLUMN     "order" INTEGER;
