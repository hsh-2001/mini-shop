export const orderNotification = async (shopId: number) => {
    const peddingOrder = await prisma.order.count({
        where: {
            status: "PENDING",
            shopId: shopId,
        }
    });

    const peddingPayment = await prisma.order.count({
        where: {
            paymentStatus: "UNPAID",
            shopId: shopId,
        }
    })

    return {
        peddingOrder,
        peddingPayment,
    };
};