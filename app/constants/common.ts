import type { OrderStatus, PaymentStatus } from "~~/prisma/generated/enums";

export const paymentStatusOptions: { label: string; value: PaymentStatus }[] = [
    { label: 'Paid', value: 'PAID' },
    { label: 'Unpaid', value: 'UNPAID' },
    { label: 'Refunded', value: 'REFUNDED' },
    { label: 'Partially Paid', value: 'PARTIALLY_PAID' },
];

export const customerTypeOptions: { label: string; value: string }[] = [
    { label: 'In Store', value: 'IN_STORE' },
    { label: 'Take Away', value: 'TAKEAWAY' },
    { label: 'Delivery', value: 'DELIVERY' },
];

export const orderStatusOptions: { label: string; value: OrderStatus }[] = [
    { label: 'Pending', value: 'PENDING' },
    { label: 'Ready', value: 'READY' },
    { label: 'Confirmed', value: 'CONFIRMED' },
    { label: 'Preparing', value: 'PREPARING' },
    { label: 'Completed', value: 'COMPLETED' },
    { label: 'Cancelled', value: 'CANCELLED' },
];