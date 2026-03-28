-- CreateTable
CREATE TABLE "shop_details" (
    "id" SERIAL NOT NULL,
    "shop_id" INTEGER NOT NULL,
    "has_drive_thru" BOOLEAN NOT NULL DEFAULT false,
    "has_seating" BOOLEAN NOT NULL DEFAULT true,
    "has_wifi" BOOLEAN NOT NULL DEFAULT true,
    "created_on" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_on" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "shop_details_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "shop_details_shop_id_key" ON "shop_details"("shop_id");

-- AddForeignKey
ALTER TABLE "shop_details" ADD CONSTRAINT "shop_details_shop_id_fkey" FOREIGN KEY ("shop_id") REFERENCES "shops"("id") ON DELETE CASCADE ON UPDATE CASCADE;
