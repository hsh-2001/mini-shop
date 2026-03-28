export interface IBaseApiResponse<T> {
    data: T;
    status: number;
    message: string;
}

export class BaseApiResponse<T> implements IBaseApiResponse<T> {
    data: T;
    status: number;
    message: string;

    constructor(data: T, status = 200, message = "Success") {
        this.data = data;
        this.status = status;
        this.message = message;
    }

    static success<T>(data: T, message = "Success"): BaseApiResponse<T> {
        return new BaseApiResponse(data, 200, message);
    }

    static error<T>(message: string, status = 400): BaseApiResponse<T> {
        return new BaseApiResponse(null as any, status, message);
    }

    get isSuccess(): boolean {
        return this.status >= 200 && this.status < 300;
    }
}

export const success = <T>(data: T, message = "Success"): BaseApiResponse<T> => {
    return BaseApiResponse.success(data, message);
}
export const fail = <T>(message: string, status = 400): BaseApiResponse<T> => {
    return BaseApiResponse.error(message, status);
}

export const getClientResponse = <T>(response: IBaseApiResponse<T>): BaseApiResponse<T> => {
    return new BaseApiResponse(response.data, response.status, response.message);
}
