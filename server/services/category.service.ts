import { Category } from "~~/generated/prisma/client";
import categoryRepo from "../repositories/category.repo";

const upsert = async (request: Category) => {
    return await categoryRepo.upsert(request);
}

const findAll = async (shopId: number) => {
    return await categoryRepo.findAll(shopId);
}

export default {
    upsert,
    findAll,
}