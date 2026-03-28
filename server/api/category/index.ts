import categoryService from "~~/server/services/category.service";
import { fail, success } from "~~/types/baseApi";

export default defineEventHandler(async (event) => {
    try {
        if (isMethod(event, "POST")) {
            const body = await readBody(event);
            const category = await categoryService.upsert(body);
            return success(category);
        }
        if (isMethod(event, "GET")) {
            const { shopId } = getQuery(event);
            const categories = await categoryService.findAll(Number(shopId));
            return success(categories);
        }
    } catch (error) {
        if (error instanceof Error) {
            return fail(error.message);
        }
    }
});
