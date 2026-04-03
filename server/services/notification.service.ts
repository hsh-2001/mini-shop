import { orderNotification } from "../repositories/notification.repo"

export const getOrderNotificationService = async (shopId: number) => {
    return await orderNotification(shopId);
}