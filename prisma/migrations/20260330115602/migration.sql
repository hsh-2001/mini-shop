/*
  Warnings:

  - You are about to alter the column `exchange_khr` on the `shops` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,4)` to `Decimal(10,6)`.
  - You are about to alter the column `exchange_usd` on the `shops` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,4)` to `Decimal(10,6)`.

*/
-- AlterTable
ALTER TABLE "shops" ALTER COLUMN "exchange_khr" SET DATA TYPE DECIMAL(10,6),
ALTER COLUMN "exchange_usd" SET DATA TYPE DECIMAL(10,6);
