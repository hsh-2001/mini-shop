import type {
    OrderStatus,
    OrderType,
    PaymentMethod,
    PaymentStatus,
} from "~~/prisma/generated/enums";
import type { ProductCategorySummary } from "~/model/inventory";

export interface CatalogProductItem {
    id: number;
    shopId: number;
    categoryId: number | null;
    name: string;
    description: string | null;
    basePrice: string | number;
    stock: number;
    category?: ProductCategorySummary | null;
}

export interface CatalogShop {
    id: number;
    name: string;
    description: string | null;
    address: string | null;
    phone: string | null;
    currencyBase: string;
    exchangeUSD: number;
    exchangeKHR: number;
}

export interface CatalogResponse {
    shop: CatalogShop | null;
    categories: ProductCategorySummary[];
    products: CatalogProductItem[];
}

export interface GuestOrderItemPayload {
    productId: number;
    quantity: number;
    selectedModifiers?: any;
}

export interface GuestOrderPayload {
    shopId: number;
    customerName: string;
    customerPhone?: string;
    customerEmail?: string;
    notes?: string;
    type: OrderType;
    paymentMethod: PaymentMethod;
    paymentStatus?: PaymentStatus;
    items: GuestOrderItemPayload[];
}

export interface ISelectedModifier {
    [key: string]: string | number | boolean;
}

export interface CashierOrderForm {
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    notes: string;
    type: OrderType;
    paymentMethod: PaymentMethod;
    paymentStatus: PaymentStatus;
}

export interface OrderItemSummary {
    id: number;
    orderId: number;
    productId: number;
    quantity: number;
    unitPrice: string | number;
    subtotal: string | number;
    selectedModifiers?: any | null;
    product?: {
        id: number;
        name: string;
        category?: ProductCategorySummary | null;
    } | null;
}

export interface IOrderSummary {
    id: number;
    shopId: number;
    customerId: number | null;
    userId: number;
    orderNumber: string;
    status: OrderStatus;
    type: OrderType;
    subtotal: string | number;
    discount: string | number | null;
    tax: string | number | null;
    finalAmount: string | number;
    paymentMethod: PaymentMethod;
    paymentStatus: PaymentStatus;
    notes: string | null;
    createdOn: string;
    updatedOn: string;
    customer?: {
        id: number;
        name: string;
        phone: string | null;
        email: string | null;
    } | null;
    user?: {
        id: number;
        username: string;
        role: string;
    } | null;
    orderItems: OrderItemSummary[];
}

export interface OrderListQuery {
    dateFrom?: string;
    dateTo?: string;
    status?: string;
    paymentStatus?: PaymentStatus;
}

export interface OrderUpdatePayload {
    id: number;
    status?: OrderStatus;
    paymentStatus?: PaymentStatus;
    notes?: string;
}


export class GetOrderSummaryListResponse implements IOrderSummary {
    id: number;
    shopId: number;
    customerId: number | null;
    userId: number;
    orderNumber: string;
    status: OrderStatus;
    type: OrderType;
    subtotal: string | number;
    discount: string | number | null;
    tax: string | number | null;
    finalAmount: string | number;
    paymentMethod: PaymentMethod;
    paymentStatus: PaymentStatus;
    notes: string | null;
    createdOn: string;
    updatedOn: string;
    customer?: { id: number; name: string; phone: string | null; email: string | null; } | null | undefined;
    user?: { id: number; username: string; role: string; } | null | undefined;
    orderItems: OrderItemSummary[];

    constructor(data: IOrderSummary) {
        this.id = data.id;
        this.shopId = data.shopId;
        this.customerId = data.customerId;
        this.userId = data.userId;
        this.orderNumber = data.orderNumber;
        this.status = data.status;
        this.type = data.type;
        this.subtotal = data.subtotal;
        this.discount = data.discount;
        this.tax = data.tax;
        this.finalAmount = data.finalAmount;
        this.paymentMethod = data.paymentMethod;
        this.paymentStatus = data.paymentStatus;
        this.notes = data.notes;
        this.createdOn = data.createdOn;
        this.updatedOn = data.updatedOn;
        this.customer = data.customer;
        this.user = data.user;
        this.orderItems = data.orderItems;
    }

    get formattedCreatedOn() {
        return this.createdOn ? getDateFormat(this.createdOn) : "--";
    }
}
