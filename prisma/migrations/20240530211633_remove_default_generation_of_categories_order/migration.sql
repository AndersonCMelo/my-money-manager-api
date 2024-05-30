-- AlterTable
ALTER TABLE "categories" ALTER COLUMN "order" DROP DEFAULT;
DROP SEQUENCE "categories_order_seq";
