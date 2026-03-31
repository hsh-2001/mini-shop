import { fail, success } from '~~/types/baseApi';
import { changePasswordService, requireAuthenticatedUser } from './../../services/auth.service';
export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event);
        const user = await requireAuthenticatedUser(event);
        const resposne = await changePasswordService(user.shopId, user.id, body);
        return success(resposne);
    } catch (error) {
        console.error("Failed to change password:", error);
        if (error instanceof Error) {
            return fail(error.message);
        }
        return fail("Failed to change password");
    }
});