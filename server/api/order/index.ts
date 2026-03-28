import { PaymentStatus } from "~~/prisma/generated/enums";
import orderService from "~~/server/services/order.service";
import { fail, success } from "~~/types/baseApi"

export default defineEventHandler(async (event) => {
    try {
        if (isMethod(event, "POST")) {
            const body = await readBody(event);
            const order = await orderService.upsert(body);
            return success(order);
        }
        if (isMethod(event, "GET")) {
            const { shopId, status, startDate, endDate } = getQuery(event);
            if (startDate && endDate) {
                const orders = await orderService.searchOrders(Number(shopId), {
                    startDate: new Date(String(startDate)),
                    endDate: new Date(String(endDate)),
                    paymentStatus: status as PaymentStatus,
                });
                return success(orders);
            } else if (status) {
                const orders = await orderService.findByStatus(Number(shopId), status as PaymentStatus);
                return success(orders);
            } else {
                const orders = await orderService.findAll(Number(shopId));
                return success(orders);
            }
        }
    } catch (error) {
        if (error instanceof Error) {
            return fail(error.message);
        }
        return fail("An unknown error occurred");
    }
});