import { Product } from "~~/prisma/generated/client";

const upsert = async (request: Product) => {
    const response = await prisma.product.upsert({
        where: { id: request.id },
        update: {
            name: request.name,
            description: request.description,
            categoryId: request.categoryId,
            shopId: request.shopId,
            basePrice: request.basePrice,
            sku: request.sku,
            barcode: request.barcode,
            stock: request.stock,
        },
        create: {
            name: request.name,
            description: request.description,
            categoryId: request.categoryId,
            shopId: request.shopId,
            basePrice: request.basePrice,
            sku: request.sku,
            barcode: request.barcode,
            stock: request.stock,
        },
    });

    return response;
};

const remove = async (id: number) => {
    const response = await prisma.product.delete({
        where: { id },
    });

    return response;
}

const fuzzySearch = async (shopId: number, keyword: string) => {
    const response = await prisma.product.findMany({
        where: {
            shopId,
            name: {
                contains: keyword,
            },
        },
    });

    return response;
};

const findAll = async (shopId: number) => {
    const response = await prisma.product.findMany({
        where: { shopId },
        include: {
            category: true,
        }
    });

    return response;
}


export default {
    upsert,
    fuzzySearch,
    findAll,
    remove,
}