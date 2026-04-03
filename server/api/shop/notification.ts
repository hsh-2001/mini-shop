import { requireAuthenticatedUser } from '~~/server/services/auth.service';
import { getOrderNotificationService } from '~~/server/services/notification.service';
import { fail, success } from '~~/types/baseApi';
export default defineEventHandler(async (event) => {
    try {
        const user = await requireAuthenticatedUser(event);
        const result = await getOrderNotificationService(user.shopId);
        return success(result);
    } catch (error) {
        return fail((error instanceof Error) ? error.message : 'Internal Error');
    }

})