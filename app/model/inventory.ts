import type { CategoryType } from "~~/prisma/generated/enums";

export interface AuthUser {
    id: number;
    shopId: number;
    phone: string;
    username: string;
    role: string;
    shop?: {
        id: number;
        name: string;
    };
}

export interface CategoryItem {
    id: number;
    shopId: number;
    name: string;
    type: CategoryType;
    description: string | null;
}

export interface CategoryPayload {
    id?: number;
    name: string;
    type: CategoryType;
    description?: string;
}

export interface ProductCategorySummary {
    id: number;
    name: string;
    type: CategoryType;
}

export interface ProductItem {
    id: number;
    shopId: number;
    categoryId: number | null;
    name: string;
    imageUrl?: string | null;
    description: string | null;
    basePrice: string | number;
    sku: string | null;
    barcode: string | null;
    stock: number;
    isActive?: boolean;
    category?: ProductCategorySummary | null;
}

export interface ProductPayload {
    id?: number;
    categoryId?: number | null;
    name: string;
    imageUrl?: string | null;
    description?: string;
    basePrice: number;
    sku?: string;
    barcode?: string;
    stock?: number;
}
