import productService from "~~/server/services/product.service";
import { success, fail } from "~~/types/baseApi";

export default defineEventHandler(async (event) => {
    try {
        if (isMethod(event, "POST")) {
            const body = await readBody(event);
            const product = await productService.upsert(body);
            return success(product);
        }
        if (isMethod(event, "GET")) {
            const { shopId, keyword } = getQuery(event);
            if (keyword) {
                const products = await productService.fuzzySearch(Number(shopId), String(keyword));
                return success(products);
            } else {
                const products = await productService.findAll(Number(shopId));
                return success(products);
            }
        }
        if (isMethod(event, "DELETE")) {
            const { id } = getQuery(event);
            const product = await productService.remove(Number(id));
            return success(product);
        }
    } catch (error) {
        if (error instanceof Error) {
            return fail(error.message);
        }
    }
});