import { IShop } from './../../app/model/setting';
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

export const updateShopSetting = async (shopId: number, data: Partial<IShop>) => {
    return await prisma.shop.update({
        where: {
            id: shopId,
        },
        data: {
            name: data.name,
            description: data.description,
            address: data.address,
            phone: data.phone,
            exchangeUSD: data.exchangeUSD,
            exchangeKHR: data.exchangeKHR,
            openingHours: data.openingHours,
        }
    });
};