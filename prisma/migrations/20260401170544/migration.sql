/*
  Warnings:

  - You are about to drop the column `domain` on the `shops` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "shops_domain_key";

-- AlterTable
ALTER TABLE "shops" DROP COLUMN "domain";

-- CreateTable
CREATE TABLE "domains" (
    "id" SERIAL NOT NULL,
    "shop_id" INTEGER NOT NULL,
    "domain" TEXT NOT NULL,
    "expiry_date" TIMESTAMP(3) NOT NULL,
    "created_on" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_on" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "domains_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "domains_shop_id_key" ON "domains"("shop_id");

-- CreateIndex
CREATE UNIQUE INDEX "domains_domain_key" ON "domains"("domain");

-- AddForeignKey
ALTER TABLE "domains" ADD CONSTRAINT "domains_shop_id_fkey" FOREIGN KEY ("shop_id") REFERENCES "shops"("id") ON DELETE CASCADE ON UPDATE CASCADE;
