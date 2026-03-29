import type { ILoginRequest } from "~/model/login";
import type {
    CatalogResponse,
    GuestOrderPayload,
    OrderListQuery,
    OrderSummary,
    OrderUpdatePayload,
} from "~/model/order";
import type {
    AuthUser,
    CategoryItem,
    CategoryPayload,
    ProductItem,
    ProductPayload,
} from "~/model/inventory";
import api from "~/utils/api";
import { BaseApiResponse, getClientResponse } from "~~/types/baseApi";

export const callLogin = async (request: ILoginRequest): Promise<BaseApiResponse<any>> => {
    const result = await api.post("/auth/login", request);
    return getClientResponse(result.data);
}

export const fetchCurrentUser = async (): Promise<AuthUser | null> => {
    const result = await api.get("/user");
    return result.data?.user ?? null;
}

export const fetchCategories = async (): Promise<BaseApiResponse<CategoryItem[]>> => {
    const result = await api.get("/category");
    return getClientResponse(result.data);
}

export const saveCategory = async (request: CategoryPayload): Promise<BaseApiResponse<CategoryItem>> => {
    const result = await api.post("/category", request);
    return getClientResponse(result.data);
}

export const fetchProducts = async (keyword?: string): Promise<BaseApiResponse<ProductItem[]>> => {
    const result = await api.get("/product", {
        params: keyword ? { keyword } : undefined,
    });
    return getClientResponse(result.data);
}

export const saveProduct = async (request: ProductPayload): Promise<BaseApiResponse<ProductItem>> => {
    const result = await api.post("/product", request);
    return getClientResponse(result.data);
}

export const deleteProduct = async (id: number): Promise<BaseApiResponse<ProductItem>> => {
    const result = await api.delete("/product", {
        params: { id },
    });
    return getClientResponse(result.data);
}

export const fetchPublicCatalog = async (): Promise<BaseApiResponse<CatalogResponse>> => {
    const result = await api.get("/order/catalog");
    return getClientResponse(result.data);
}

export const createGuestOrder = async (request: GuestOrderPayload): Promise<BaseApiResponse<OrderSummary>> => {
    const result = await api.post("/order", request);
    return getClientResponse(result.data);
}

export const createCashierOrder = async (
    request: Omit<GuestOrderPayload, "shopId"> & Partial<Pick<GuestOrderPayload, "shopId">>,
): Promise<BaseApiResponse<OrderSummary>> => {
    const result = await api.post("/order", request);
    return getClientResponse(result.data);
}

export const fetchOrders = async (query?: OrderListQuery): Promise<BaseApiResponse<OrderSummary[]>> => {
    const result = await api.get("/order", {
        params: query,
    });
    return getClientResponse(result.data);
}

export const updateOrder = async (request: OrderUpdatePayload): Promise<BaseApiResponse<OrderSummary>> => {
    const result = await api.patch("/order", request);
    return getClientResponse(result.data);
}
