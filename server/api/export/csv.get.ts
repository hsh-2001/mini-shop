import orderService from "~~/server/services/order.service";
import { success } from "~~/types/baseApi";
import product from "../product";

export default defineEventHandler(async (event) => {
    try {
        const query = getQuery(event);
        if (query.page === 'order') {
            const data = await orderService.findAll(1);
            const mapData = data.map(order => ({
                orderId: order.id,
                type: order.type,
                status: order.status,
                paymentStatus: order.paymentStatus,
                customer: order.customer?.email || "Guest",
                total: order.finalAmount,
                products: order.orderItems.map(item => `${item.product.name} (x${item.quantity})`).join("; "),
                createdOn: order.createdOn.toISOString(),
            }));
            const headers = Object.keys(mapData.at(0) || {});
            const csv = [headers.join(","), ...mapData.map(row => Object.values(row).join(","))].join("\n");
            setHeader(event, "Content-Type", "text/csv");
            setHeader(event, "Content-Disposition", "attachment; filename=orders.csv");

            return csv;
        }
        return success("No data to export");
    } catch (error) {
        return createError({
            statusCode: 500,
            message: "Failed to export orders to CSV",
        });
    }
});