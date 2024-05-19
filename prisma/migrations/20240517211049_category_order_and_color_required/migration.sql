/*
  Warnings:

  - Made the column `color` on table `categories` required. This step will fail if there are existing NULL values in that column.
  - Made the column `order` on table `categories` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "categories" ALTER COLUMN "color" SET NOT NULL,
ALTER COLUMN "order" SET NOT NULL;
