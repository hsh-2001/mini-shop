import { requireAuthenticatedUser } from '~~/server/services/auth.service';
import { getOverviewService } from '~~/server/services/setting.service';
import { success } from '~~/types/baseApi';
export default defineEventHandler(async (event) => {
    try {
        const user = await requireAuthenticatedUser(event);
        const response = await getOverviewService(user.shopId);
        return success(response);
    } catch (error) {
        console.error('Error fetching shop overview:', error);
        throw createError({ statusCode: 500, message: 'Failed to fetch shop overview' });
    }
});