import categoryService from "~~/server/services/category.service";
import { requireAuthenticatedUser } from "~~/server/services/auth.service";
import { fail, success } from "~~/types/baseApi";

export default defineEventHandler(async (event) => {
    try {
        const user = await requireAuthenticatedUser(event);

        if (isMethod(event, "POST")) {
            const body = await readBody(event);
            const category = await categoryService.upsert({
                id: body.id ? Number(body.id) : undefined,
                name: String(body.name ?? "").trim(),
                type: body.type,
                description: body.description ? String(body.description).trim() : null,
                shopId: user.shopId,
            });
            return success(category);
        }
        if (isMethod(event, "GET")) {
            const categories = await categoryService.findAll(user.shopId);
            return success(categories);
        }
        return fail("Method not allowed", 405);
    } catch (error) {
        if (error instanceof Error) {
            return fail(error.message);
        }
        return fail("An unknown error occurred");
    }
});
