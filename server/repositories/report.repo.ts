import { ISaleReportRequest } from './../../types/report';
export const getSalesReport = async (param: ISaleReportRequest) => {
    const result = await prisma.order.findMany({
        where: {
            shopId: param.shopId,
            createdOn: {
                gte: param.startDate ? param.startDate : new Date(0),
                lte: param.endDate ? param.endDate : new Date(),
            },
            paymentStatus: param.paymentStatus ? param.paymentStatus : undefined,
            status: param.orderStatus ? param.orderStatus : undefined,
        },
        include: {
            customer: {
                select: {
                    id: true,
                    name: true,
                    phone: true,
                    email: true,
                }
            },
            orderItems: {
                include: {
                    product: true,
                },
            },
        },
    });
    return result;
}