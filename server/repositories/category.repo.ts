import { CategoryType } from "~~/prisma/generated/enums";

export interface CategoryUpsertInput {
    id?: number;
    shopId: number;
    name: string;
    type: CategoryType;
    description?: string | null;
}

const upsert = async (request: CategoryUpsertInput) => {
    const response = await prisma.category.upsert({
        where: { id: request.id ?? 0 },
        update: {
            name: request.name,
            type: request.type,
            shopId: request.shopId,
            description: request.description ?? null,
        },
        create: {
            name: request.name,
            type: request.type,
            shopId: request.shopId,
            description: request.description ?? null,
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
