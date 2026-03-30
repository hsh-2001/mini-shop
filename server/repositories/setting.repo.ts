export const getShop = async (shopId: number) => {
    return await prisma.shop.findUnique({
        where: {
            id: shopId,
        },
        include: {
            users: {
                take: 1,
                select: {
                    username: true,
                    phone: true,
                },
                where: {
                    role: "OWNER",
                }
            }
        }
    });
}