import orderService from "~~/server/services/order.service";
import { getAuthenticatedUser, requireAuthenticatedUser } from "~~/server/services/auth.service";
import { fail, success } from "~~/types/baseApi"

export default defineEventHandler(async (event) => {
    try {
        if (isMethod(event, "POST")) {
            const authenticatedUser = await getAuthenticatedUser(event);
            const body = await readBody(event);
            const order = await orderService.createGuestOrder({
                shopId: authenticatedUser?.shopId ?? Number(body.shopId),
                userId: authenticatedUser?.id,
                customerName: String(body.customerName ?? "").trim(),
                customerPhone: body.customerPhone ? String(body.customerPhone).trim() : null,
                customerEmail: body.customerEmail ? String(body.customerEmail).trim() : null,
                notes: body.notes ? String(body.notes).trim() : null,
                type: body.type,
                paymentMethod: body.paymentMethod,
                items: Array.isArray(body.items)
                    ? body.items.map((item) => ({
                        productId: Number(item.productId),
                        quantity: Number(item.quantity),
                    }))
                    : [],
            });
            return success(order);
        }
        if (isMethod(event, "GET")) {
            const user = await requireAuthenticatedUser(event);
            const { status, paymentStatus } = getQuery(event);
            const orders = await orderService.findAll(user.shopId, {
                status: status ? String(status) as any : undefined,
                paymentStatus: paymentStatus ? String(paymentStatus) as any : undefined,
            });
            return success(orders);
        }
        if (isMethod(event, "PATCH")) {
            const user = await requireAuthenticatedUser(event);
            const body = await readBody(event);
            const order = await orderService.updateOrder({
                id: Number(body.id),
                shopId: user.shopId,
                status: body.status,
                paymentStatus: body.paymentStatus,
                notes: body.notes,
            });
            return success(order);
        }
        return fail("Method not allowed", 405);
    } catch (error) {
        if (error instanceof Error) {
            return fail(error.message);
        }
        return fail("An unknown error occurred");
    }
});
