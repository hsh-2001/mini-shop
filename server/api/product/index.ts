import productService from "~~/server/services/product.service";
import { requireAuthenticatedUser } from "~~/server/services/auth.service";
import { success, fail } from "~~/types/baseApi";

export default defineEventHandler(async (event) => {
    try {
        const user = await requireAuthenticatedUser(event);

        if (isMethod(event, "POST")) {
            const body = await readBody(event);
            const product = await productService.upsert({
                id: body.id ? Number(body.id) : undefined,
                name: String(body.name ?? "").trim(),
                description: body.description ? String(body.description).trim() : null,
                categoryId: body.categoryId ? Number(body.categoryId) : null,
                shopId: user.shopId,
                basePrice: Number(body.basePrice ?? 0),
                sku: body.sku ? String(body.sku).trim() : null,
                barcode: body.barcode ? String(body.barcode).trim() : null,
                stock: body.stock !== undefined && body.stock !== null && body.stock !== ""
                    ? Number(body.stock)
                    : -1,
            });
            return success(product);
        }
        if (isMethod(event, "GET")) {
            const { keyword } = getQuery(event);
            if (keyword) {
                const products = await productService.fuzzySearch(user.shopId, String(keyword));
                return success(products);
            } else {
                const products = await productService.findAll(user.shopId);
                return success(products);
            }
        }
        if (isMethod(event, "DELETE")) {
            const { id } = getQuery(event);
            const product = await productService.remove(Number(id));
            return success(product);
        }
        return fail("Method not allowed", 405);
    } catch (error) {
        if (error instanceof Error) {
            return fail(error.message);
        }
        return fail("An unknown error occurred");
    }
});
