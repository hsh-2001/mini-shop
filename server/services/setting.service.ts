import { IShop } from "~/model/setting";
import { getOverview, getShop, updateShopSetting } from "../repositories/setting.repo";

export const getShopService = async (shopId: number) => {
    return await getShop(shopId);
}

export const updateShopSettingService = async (shopId: number, data: Partial<IShop>) => {
    return await updateShopSetting(shopId, data);
}

export const getOverviewService = async (shopId: number) => {
    return await getOverview(shopId);
}