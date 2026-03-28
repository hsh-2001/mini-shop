import { Product } from "~~/prisma/generated/client";
import productRepo from "../repositories/product.repo";

const upsert = async (request: Product) => {
    return await productRepo.upsert(request);
}

const remove = async (id: number) => {
    return await productRepo.remove(id);
}

const fuzzySearch = async (shopId: number, keyword: string) => {
    return await productRepo.fuzzySearch(shopId, keyword);
}

const findAll = async (shopId: number) => {
    return await productRepo.findAll(shopId);
}

export default {
    upsert,
    fuzzySearch,
    findAll,
    remove,
}