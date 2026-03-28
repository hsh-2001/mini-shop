import categoryRepo, { type CategoryUpsertInput } from "../repositories/category.repo";

const upsert = async (request: CategoryUpsertInput) => {
    return await categoryRepo.upsert(request);
}

const findAll = async (shopId: number) => {
    return await categoryRepo.findAll(shopId);
}

export default {
    upsert,
    findAll,
}
