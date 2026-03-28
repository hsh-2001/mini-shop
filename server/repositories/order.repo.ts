import { Order, OrderItem, PaymentStatus } from "~~/prisma/generated/client";

const upsert = async (request: Order & { orderItems: OrderItem[] }) => {
    return await prisma.order.upsert({
        where: { id: request.id },
        update: {
            shopId: request.shopId,
            userId: request.userId,
            orderNumber: request.orderNumber,
            subtotal: request.subtotal,
            tax: request.tax,
            status: request.status,
            finalAmount: request.finalAmount,
            paymentMethod: request.paymentMethod,
            paymentStatus: request.paymentStatus,
            orderItems: {
                create: request.orderItems.map((item) => ({
                    orderId: item.orderId,
                    productId: item.productId,
                    quantity: item.quantity,
                    unitPrice: item.unitPrice,
                    subtotal: item.subtotal,
                }))
            }
        },
        create: {
            shopId: request.shopId,
            userId: request.userId,
            orderNumber: request.orderNumber,
            subtotal: request.subtotal,
            tax: request.tax,
            status: request.status,
            finalAmount: request.finalAmount,
            paymentMethod: request.paymentMethod,
            paymentStatus: request.paymentStatus,
            orderItems: {
                create: request.orderItems.map((item) => ({
                    orderId: item.orderId,
                    productId: item.productId,
                    quantity: item.quantity,
                    unitPrice: item.unitPrice,
                    subtotal: item.subtotal,
                }))
            }
        },
        include: {
            orderItems: true,
        }
    });
};

const findAll = async (shopId: number) => {
    return await prisma.order.findMany({
        where: { shopId },
        include: {
            orderItems: true,
        }
    });
};

const findById = async (id: number) => {
    return await prisma.order.findUnique({
        where: { id },
        include: {
            orderItems: true,
        }
    });
};

const findByStatus = async (shopId: number, status: PaymentStatus) => {
    return await prisma.order.findMany({
        where: { shopId, paymentStatus: status },
        include: {
            orderItems: true,
        }
    });
};

const searchOrders = async (shopId: number, query: { startDate: Date, endDate: Date, paymentStatus?: PaymentStatus }) => {
    return await prisma.order.findMany({
        where: {
            shopId,
            createdOn: {
                gte: query.startDate,
                lte: query.endDate,
            },
            ...(query.paymentStatus && { paymentStatus: query.paymentStatus }),
        },
        include: {
            orderItems: true,
        }
    });
};

export default {
    upsert,
    findAll,
    findById,
    findByStatus,
    searchOrders,
}