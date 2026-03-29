import { createUserService, getUsersService, requireAuthenticatedUser, updateUserService } from "~~/server/services/auth.service";
import { fail, success } from "~~/types/baseApi";

export default defineEventHandler(async (event) => {
    try {
        if (isMethod(event, "POST")) {
            const body = await readBody(event);
            const user = await requireAuthenticatedUser(event);
            body.shopId = user.shopId;
            const result = await createUserService(body);
            return success(result, "User created successfully.");
        }

        if (isMethod(event, "PATCH")) {
            const body = await readBody(event);
            const result = await updateUserService(body.id, body);
            return success(result);
        }

        if (isMethod(event, "GET")) {
            const user = await requireAuthenticatedUser(event);
            const response = await getUsersService(user.shopId);
            return success(response);
        }

        return fail("Method not allowed", 405);
    } catch (error) {
        if (error instanceof Error) {
            return fail(error.message);
        }
        return fail("An unknown error occurred.");
    }
});
