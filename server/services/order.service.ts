import type { CreateGuestOrderInput, OrderListQuery, UpdateOrderInput } from "../repositories/order.repo";
import orderRepo from "../repositories/order.repo";

const createGuestOrder = async (request: CreateGuestOrderInput) => {
    return orderRepo.createGuestOrder(request);
};

const findAll = async (shopId: number, query?: OrderListQuery) => {
    return orderRepo.findAll(shopId, query);
};

const updateOrder = async (request: UpdateOrderInput) => {
    return orderRepo.updateOrder(request);
};

export default {
    createGuestOrder,
    findAll,
    updateOrder,
}
