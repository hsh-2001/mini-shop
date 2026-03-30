import { getShop } from "../repositories/setting.repo";

export const getShopService = async (shopId: number) => {
    return await getShop(shopId);
}