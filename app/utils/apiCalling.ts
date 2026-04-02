import type { ILoginRequest } from "~/model/login";
import type {
    CatalogResponse,
    GuestOrderPayload,
    OrderListQuery,
    IOrderSummary,
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
import type { ICreateUser, MemberResponse } from "~~/types/member";
import type { ShopResponse } from "~/model/setting";
import type { Overview } from "~/model/overview";
import type { ISaleReportRequest } from "~~/types/report";
import type { SaleReportResponse } from "~/model/report";

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

export const callGetAllProducts = async (keyword?: string): Promise<BaseApiResponse<ProductItem[]>> => {
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

export const createGuestOrder = async (request: GuestOrderPayload): Promise<BaseApiResponse<IOrderSummary>> => {
    const result = await api.post("/order", request);
    return getClientResponse(result.data);
}

export const createCashierOrder = async (
    request: Omit<GuestOrderPayload, "shopId"> & Partial<Pick<GuestOrderPayload, "shopId">>,
): Promise<BaseApiResponse<IOrderSummary>> => {
    const result = await api.post("/order", request);
    return getClientResponse(result.data);
}

export const fetchOrders = async (query?: OrderListQuery): Promise<BaseApiResponse<IOrderSummary[]>> => {
    const result = await api.get("/order", {
        params: query,
    });
    return getClientResponse(result.data);
}

export const updateOrder = async (request: OrderUpdatePayload): Promise<BaseApiResponse<IOrderSummary>> => {
    const result = await api.patch("/order", request);
    return getClientResponse(result.data);
}


export const getAllMembers = async (): Promise<BaseApiResponse<MemberResponse[]>> => {
    const result = await api.get("/member");
    return getClientResponse(result.data);
}

export const callCreateMember = async (request: ICreateUser): Promise<BaseApiResponse<MemberResponse>> => {
    const result = await api.post("/member", request);
    return getClientResponse(result.data);
}
export const callUpdateMember = async (id: number, request: Partial<ICreateUser>): Promise<BaseApiResponse<MemberResponse>> => {
    const result = await api.patch("/member", { id, ...request });
    return getClientResponse(result.data);
}

export const callUpload = async (file: File, path = ""): Promise<BaseApiResponse<{ url: string, filename: string }>> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("path", path);
    const result = await api.post("/upload", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return getClientResponse(result.data);
}

export const getImageFile = async (filePath: string): Promise<BaseApiResponse<{ url: string }>> => {
    const result = await api.get("/upload", {
        params: { filename: filePath },
    });
    return getClientResponse(result.data);
}

export const callGetShopSetting = async (): Promise<BaseApiResponse<ShopResponse>> => {
    const result = await api.get("/shop/setting");
    return getClientResponse(result.data);
}

export const callUpdateShopSetting = async (data: Partial<ShopResponse>): Promise<BaseApiResponse<ShopResponse>> => {
    const result = await api.post("/shop/setting", data);
    return getClientResponse(result.data);
}

export const callGetOverview = async (): Promise<BaseApiResponse<Overview>> => {
    const result = await api.get("/shop/overview");
    return getClientResponse(result.data);
}

export const callChangePassword = async (currentPassword: string, newPassword: string): Promise<BaseApiResponse<any>> => {
    const result = await api.post("/auth/change-password", { currentPassword, newPassword });
    return getClientResponse(result.data);
}

export const callGetSalesReport = async (query: any): Promise<BaseApiResponse<SaleReportResponse[]>> => {
    const result = await api.get("/reports/sale-report", {
        params: query,
    });
    return getClientResponse(result.data);
}