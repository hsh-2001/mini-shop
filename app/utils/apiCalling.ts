import type { ILoginRequest } from "~/model/login";
import { BaseApiResponse, getClientResponse } from "~~/types/baseApi";

export const callLogin = async (request: ILoginRequest): Promise<BaseApiResponse<any>> => {
    const result = await api.post("/auth/login", request);
    return getClientResponse(result.data);
}