import { requireAuthenticatedUser } from '~~/server/services/auth.service';
import { getSalesReportService } from "~~/server/services/report.service";
import { fail, success } from '~~/types/baseApi';
import { ISaleReportRequest } from '~~/types/report';

export default defineEventHandler(async (event) => {
    try {
        const query = getQuery<ISaleReportRequest>(event);
        const user = await requireAuthenticatedUser(event);
        const data = await getSalesReportService({
            shopId: user.shopId,
            startDate: query.startDate,
            endDate: query.endDate,
            paymentStatus: query.paymentStatus,
            orderStatus: query.orderStatus,
        });
        return success(data);
    } catch (error) {
        return fail(error instanceof Error ? error.message : "Failed to fetch sales report");
    }
});