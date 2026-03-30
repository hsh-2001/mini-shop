export interface IShop {
    id: number;
    name: string;
    description: string;
    address: string;
    phone: string;
    currencyBase: string;
    exchangeUSD: number;
    exchangeKHR: number;
    openingHours: string;
}

export interface IUser {
    username: string;
    phone: string;
}

export type IShopResponse = IShop & {
    users: IUser[];
};

export class ShopResponse implements IShopResponse {
    id: number;
    name: string;
    description: string;
    address: string;
    phone: string;
    currencyBase: string;
    exchangeUSD: number;
    exchangeKHR: number;
    openingHours: string;
    users: IUser[];

    constructor(data: IShopResponse) {
        this.id = data.id;
        this.name = data.name;
        this.description = data.description;
        this.address = data.address;
        this.phone = data.phone;
        this.currencyBase = data.currencyBase ?? "USD";
        this.exchangeUSD = data.exchangeUSD;
        this.exchangeKHR = data.exchangeKHR;
        this.openingHours = data.openingHours;
        this.users = data?.users?.map(u => ({
            username: u.username,
            phone: u.phone,
        })) ?? [];
    }
}

export type IUpdateShopRequest = Partial<IShop> & Partial<IUser>;