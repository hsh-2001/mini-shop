import productRepo from "~~/server/repositories/product.repo";
import { prisma } from "~~/server/utils/db";
import { fail, success } from "~~/types/baseApi";

export default defineEventHandler(async () => {
    try {
        const shop = await prisma.shop.findFirst({
            orderBy: {
                id: "asc",
            },
            select: {
                id: true,
                name: true,
                description: true,
                address: true,
                phone: true,
                categories: {
                    select: {
                        id: true,
                        name: true,
                        type: true,
                    },
                    orderBy: {
                        name: "asc",
                    },
                },
            },
        });

        if (!shop) {
            return success({
                shop: null,
                categories: [],
                products: [],
            });
        }

        const products = await productRepo.findActiveByShopId(shop.id);

        return success({
            shop: {
                id: shop.id,
                name: shop.name,
                description: shop.description,
                address: shop.address,
                phone: shop.phone,
            },
            categories: shop.categories,
            products,
        });
    } catch (error) {
        if (error instanceof Error) {
            return fail(error.message);
        }

        return fail("An unknown error occurred");
    }
});
