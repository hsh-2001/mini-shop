import type { OrderStatus, OrderType, PaymentMethod, PaymentStatus } from "~~/prisma/generated/enums";
import { prisma } from "../utils/db";

export interface CreateGuestOrderInput {
    shopId: number;
    userId?: number;
    customerName: string;
    customerPhone?: string | null;
    customerEmail?: string | null;
    notes?: string | null;
    type: OrderType;
    paymentMethod: PaymentMethod;
    paymentStatus?: PaymentStatus;
    status?: OrderStatus;
    items: Array<{
        productId: number;
        quantity: number;
    }>;
}

export interface OrderListQuery {
    status?: OrderStatus;
    paymentStatus?: PaymentStatus;
}

export interface UpdateOrderInput {
    id: number;
    shopId: number;
    status?: OrderStatus;
    paymentStatus?: PaymentStatus;
    notes?: string | null;
}

const orderInclude = {
    customer: {
        select: {
            id: true,
            name: true,
            phone: true,
            email: true,
        },
    },
    user: {
        select: {
            id: true,
            username: true,
            role: true,
        },
    },
    orderItems: {
        include: {
            product: {
                select: {
                    id: true,
                    name: true,
                    category: {
                        select: {
                            id: true,
                            name: true,
                            type: true,
                        },
                    },
                },
            },
        },
    },
} as const;

const createGuestOrder = async (request: CreateGuestOrderInput) => {
    return prisma.$transaction(async (tx) => {
        const [shop, fallbackUser, products] = await Promise.all([
            tx.shop.findUnique({
                where: { id: request.shopId },
                select: { id: true },
            }),
            request.userId
                ? Promise.resolve({ id: request.userId })
                : tx.user.findFirst({
                    where: { shopId: request.shopId },
                    orderBy: [
                        { role: "asc" },
                        { id: "asc" },
                    ],
                    select: { id: true },
                }),
            tx.product.findMany({
                where: {
                    shopId: request.shopId,
                    isActive: true,
                    id: {
                        in: request.items.map((item) => item.productId),
                    },
                },
                select: {
                    id: true,
                    name: true,
                    basePrice: true,
                    stock: true,
                },
            }),
        ]);

        if (!shop) {
            throw new Error("Shop not found.");
        }

        if (!fallbackUser) {
            throw new Error("No seller account is available to receive orders.");
        }

        if (!request.items.length) {
            throw new Error("Order must include at least one item.");
        }

        const productMap = new Map(products.map((product) => [product.id, product]));
        const normalizedItems = request.items.map((item) => {
            const product = productMap.get(item.productId);

            if (!product) {
                throw new Error("One or more products are unavailable.");
            }

            if (item.quantity <= 0) {
                throw new Error("Item quantity must be greater than zero.");
            }

            if (product.stock >= 0 && product.stock < item.quantity) {
                throw new Error(`${product.name} does not have enough stock.`);
            }

            const unitPrice = Number(product.basePrice);
            const subtotal = Number((unitPrice * item.quantity).toFixed(2));

            return {
                productId: item.productId,
                quantity: item.quantity,
                unitPrice,
                subtotal,
            };
        });

        const subtotal = Number(
            normalizedItems.reduce((sum, item) => sum + item.subtotal, 0).toFixed(2),
        );
        const discount = 0;
        const tax = 0;
        const finalAmount = subtotal;

        let customerId: number | null = null;
        const customerName = request.customerName.trim();
        const customerPhone = request.customerPhone?.trim() || null;
        const customerEmail = request.customerEmail?.trim() || null;

        if (customerName || customerPhone || customerEmail) {
            if (customerPhone) {
                const existingCustomer = await tx.customer.findFirst({
                    where: {
                        shopId: request.shopId,
                        phone: customerPhone,
                    },
                    select: { id: true },
                });

                if (existingCustomer) {
                    const updatedCustomer = await tx.customer.update({
                        where: { id: existingCustomer.id },
                        data: {
                            name: customerName || "Guest Customer",
                            email: customerEmail,
                        },
                        select: { id: true },
                    });
                    customerId = updatedCustomer.id;
                } else {
                    const createdCustomer = await tx.customer.create({
                        data: {
                            shopId: request.shopId,
                            name: customerName || "Guest Customer",
                            phone: customerPhone,
                            email: customerEmail,
                        },
                        select: { id: true },
                    });
                    customerId = createdCustomer.id;
                }
            } else if (customerName || customerEmail) {
                const createdCustomer = await tx.customer.create({
                    data: {
                        shopId: request.shopId,
                        name: customerName || "Guest Customer",
                        email: customerEmail,
                    },
                    select: { id: true },
                });
                customerId = createdCustomer.id;
            }
        }

        const orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)
            .toString()
            .padStart(3, "0")}`;

        const order = await tx.order.create({
            data: {
                shopId: request.shopId,
                customerId,
                userId: fallbackUser.id,
                orderNumber,
                status: request.status || "PENDING",
                type: request.type,
                subtotal,
                discount,
                tax,
                finalAmount,
                paymentMethod: request.paymentMethod,
                paymentStatus: request.paymentStatus || "UNPAID",
                notes: request.notes?.trim() || null,
                orderItems: {
                    create: normalizedItems.map((item) => ({
                        productId: item.productId,
                        quantity: item.quantity,
                        unitPrice: item.unitPrice,
                        subtotal: item.subtotal,
                    })),
                },
            },
            include: orderInclude,
        });

        await Promise.all(
            normalizedItems.map((item) =>
                tx.product.update({
                    where: { id: item.productId },
                    data: {
                        stock: {
                            decrement: productMap.get(item.productId)?.stock === -1 ? 0 : item.quantity,
                        },
                    },
                })),
        );

        return order;
    });
};

const findAll = async (shopId: number, query?: OrderListQuery) => {
    return prisma.order.findMany({
        where: {
            shopId,
            ...(query?.status ? { status: query.status } : {}),
            ...(query?.paymentStatus ? { paymentStatus: query.paymentStatus } : {}),
        },
        include: orderInclude,
        orderBy: {
            createdOn: "desc",
        },
    });
};

const updateOrder = async (request: UpdateOrderInput) => {
    const existingOrder = await prisma.order.findFirst({
        where: {
            id: request.id,
            shopId: request.shopId,
        },
        select: { id: true },
    });

    if (!existingOrder) {
        throw new Error("Order not found.");
    }

    return prisma.order.update({
        where: { id: request.id },
        data: {
            ...(request.status ? { status: request.status } : {}),
            ...(request.paymentStatus ? { paymentStatus: request.paymentStatus } : {}),
            ...(request.notes !== undefined ? { notes: request.notes?.trim() || null } : {}),
        },
        include: orderInclude,
    });
};

export default {
    createGuestOrder,
    findAll,
    updateOrder,
};
