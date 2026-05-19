export const orderNotification = async (shopId: number) => {
    const pendingOrder = await prisma.order.count({
        where: {
            status: "PENDING",
            shopId: shopId,
        },
    });

    const pendingPayment = await prisma.order.count({
        where: {
            paymentStatus: "UNPAID",
            status: { not: "CANCELLED" },
            shopId: shopId,
        },
    });

    return {
        pendingOrder,
        pendingPayment,
    };
};