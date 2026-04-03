export interface IOrder {
    id: number
    shopId: number
    customerId: number
    userId: number
    orderNumber: string
    status: 'PENDING' | 'READY' | 'COMPLETED' | string
    type: 'IN_STORE' | string
    subtotal: string
    discount: string
    tax: string
    finalAmount: string
    paymentMethod: 'CASH' | string
    paymentStatus: 'UNPAID' | string
    notes: string | null
    createdOn: string
    updatedOn: string
    customer: ICustomer
    orderItems: IOrderItem[]
}

export interface IOrderItem {
    id: number
    orderId: number
    productId: number
    quantity: number
    unitPrice: string
    subtotal: string
    selectedModifiers: ISelectedModifier[]
    createdOn: string
    updatedOn: string
    product: IProduct
}

export interface ISelectedModifier {
    ice: number
    sugar: number | string
    size?: string
    quantity?: number
}

export interface ICustomer {
    id: number
    shopId: number
    name: string
    phone: string | null
    email: string | null
    loyaltyPoints: number
    createdOn: string
    updatedOn: string
}
interface IProduct {
    id: number
    shopId: number
    categoryId: number
    name: string
    description: string | null
    basePrice: string
    size: string | null
    isCustomizable: boolean
    sku: string | null
    barcode: string | null
    stock: number
    unit: string
    lowStockThreshold: number
    isActive: boolean
    createdOn: string
    updatedOn: string
    imageUrl: string | null
}

export class SaleReportResponse implements IOrder {
    id: number;
    shopId: number;
    customerId: number;
    userId: number;
    orderNumber: string;
    status: 'PENDING' | 'READY' | 'COMPLETED' | string;
    type: 'IN_STORE' | string;
    subtotal: string;
    discount: string;
    tax: string;
    finalAmount: string;
    paymentMethod: 'CASH' | string;
    paymentStatus: 'UNPAID' | string;
    notes: string | null;
    createdOn: string;
    updatedOn: string;
    orderItems: IOrderItem[];
    customer: ICustomer;

    constructor(orderData: IOrder) {
        this.id = orderData.id;
        this.shopId = orderData.shopId;
        this.customerId = orderData.customerId;
        this.userId = orderData.userId;
        this.orderNumber = orderData.orderNumber;
        this.status = orderData.status;
        this.type = orderData.type;
        this.subtotal = orderData.subtotal;
        this.discount = orderData.discount;
        this.tax = orderData.tax;
        this.finalAmount = orderData.finalAmount;
        this.paymentMethod = orderData.paymentMethod;
        this.paymentStatus = orderData.paymentStatus;
        this.notes = orderData.notes;
        this.createdOn = orderData.createdOn;
        this.updatedOn = orderData.updatedOn;
        this.orderItems = orderData.orderItems;
        this.customer = orderData.customer;
    }

    get getFinalAmount() {
        return formatCurrency(Number(this.finalAmount));
    }

    get getCreatedOn() {
        return getDateFormat(this.createdOn);
    }
}