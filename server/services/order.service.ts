import { Order, OrderItem, PaymentStatus } from "~~/prisma/generated/client";
import orderRepo from "../repositories/order.repo";

const upsert = async (request: Order & { orderItems: OrderItem[] }) => {
    return await orderRepo.upsert(request);
};

const findAll = async (shopId: number) => {
    return await orderRepo.findAll(shopId);
};

const findById = async (id: number) => {
    return await orderRepo.findById(id);
};

const findByStatus = async (shopId: number, status: PaymentStatus) => {
    return await orderRepo.findByStatus(shopId, status);
};

const searchOrders = async (shopId: number, query: { startDate: Date, endDate: Date, paymentStatus?: PaymentStatus }) => {
    return await orderRepo.searchOrders(shopId, query);
};

export default {
    upsert,
    findAll,
    findById,
    findByStatus,
    searchOrders,
}