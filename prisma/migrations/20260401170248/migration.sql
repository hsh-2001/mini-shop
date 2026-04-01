/*
  Warnings:

  - A unique constraint covering the columns `[domain]` on the table `shops` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "shops" ADD COLUMN     "domain" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "shops_domain_key" ON "shops"("domain");
