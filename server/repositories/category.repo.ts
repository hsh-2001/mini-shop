import { Category } from "~~/generated/prisma/client";

const upsert = async (request: Category) => {
    const response = await prisma.category.upsert({
        where: { id: request.id },
        update: {
            name: request.name,
            type: request.type,
            shopId: request.shopId,
            description: request.description,
        },
        create: {
            name: request.name,
            type: request.type,
            shopId: request.shopId,
            description: request.description,
        },
    });

    return response;
};

const findAll = async (shopId: number) => {
    const response = await prisma.category.findMany({
        where: { shopId },
    });

    return response;
};


export default {
    upsert,
    findAll,
}