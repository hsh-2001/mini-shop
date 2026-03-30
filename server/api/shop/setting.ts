import { getShopService, updateShopSettingService } from "~~/server/services/setting.service";
import { requireAuthenticatedUser } from "~~/server/services/auth.service";
import { fail, success } from "~~/types/baseApi";

export default defineEventHandler(async (event) => {
    try {
        if (isMethod(event, "POST")) {
            const body = await readBody(event);
            const user = await requireAuthenticatedUser(event);
            const shop = await updateShopSettingService(user.shopId, body);
            return success(shop);
        }
        if (isMethod(event, "GET")) {
            const user = await requireAuthenticatedUser(event);
            const shop = await getShopService(user.shopId);
            return success(shop)
        }

    } catch (error) {
        if (error instanceof Error) {
            return fail(error.message)
        }
        return fail("An unknown error occurred")
    }
});