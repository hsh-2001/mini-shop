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
}

export interface CatalogResponse {
    shop: CatalogShop | null;
    categories: ProductCategorySummary[];
    products: CatalogProductItem[];
}

export interface GuestOrderItemPayload {
    productId: number;
    quantity: number;
}

export interface GuestOrderPayload {
    shopId: number;
    customerName: string;
    customerPhone?: string;
    customerEmail?: string;
    notes?: string;
    type: OrderType;
    paymentMethod: PaymentMethod;
    items: GuestOrderItemPayload[];
}

export interface CashierOrderForm {
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    notes: string;
    type: OrderType;
    paymentMethod: PaymentMethod;
}

export interface OrderItemSummary {
    id: number;
    orderId: number;
    productId: number;
    quantity: number;
    unitPrice: string | number;
    subtotal: string | number;
    product?: {
        id: number;
        name: string;
        category?: ProductCategorySummary | null;
    } | null;
}

export interface OrderSummary {
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
    status?: OrderStatus;
    paymentStatus?: PaymentStatus;
}

export interface OrderUpdatePayload {
    id: number;
    status?: OrderStatus;
    paymentStatus?: PaymentStatus;
    notes?: string;
}
