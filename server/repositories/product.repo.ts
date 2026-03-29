export interface ProductUpsertInput {
    id?: number;
    shopId: number;
    categoryId?: number | null;
    name: string;
    imageUrl?: string | null;
    description?: string | null;
    basePrice: number;
    sku?: string | null;
    barcode?: string | null;
    stock?: number;
}

const upsert = async (request: ProductUpsertInput) => {
    const response = await prisma.product.upsert({
        where: { id: request.id ?? 0 },
        update: {
            name: request.name,
            imageUrl: request.imageUrl ?? null,
            description: request.description ?? null,
            categoryId: request.categoryId ?? null,
            shopId: request.shopId,
            basePrice: request.basePrice,
            sku: request.sku ?? null,
            barcode: request.barcode ?? null,
            stock: request.stock ?? -1,
        },
        create: {
            name: request.name,
            imageUrl: request.imageUrl ?? null,
            description: request.description ?? null,
            categoryId: request.categoryId ?? null,
            shopId: request.shopId,
            basePrice: request.basePrice,
            sku: request.sku ?? null,
            barcode: request.barcode ?? null,
            stock: request.stock ?? -1,
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
        include: {
            category: true,
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

const findActiveByShopId = async (shopId: number) => {
    return prisma.product.findMany({
        where: {
            shopId,
            isActive: true,
        },
        include: {
            category: true,
        },
        orderBy: [
            { categoryId: "asc" },
            { name: "asc" },
        ],
    });
}


export default {
    upsert,
    fuzzySearch,
    findAll,
    findActiveByShopId,
    remove,
}
