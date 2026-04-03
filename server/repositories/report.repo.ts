import { ISaleReportRequest } from './../../types/report';
export const getSalesReport = async (param: ISaleReportRequest) => {
    const result = await prisma.order.findMany({
        where: {
            shopId: param.shopId,
            createdOn: {
                gte: param.startDate ? new Date(param.startDate) : new Date(0),
                lte: param.endDate ? new Date(param.endDate) : new Date(),
            },
            paymentStatus: param.paymentStatus || undefined,
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