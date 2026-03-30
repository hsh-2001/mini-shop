import { defineStore } from 'pinia'
import type { CategoryItem, ProductItem } from '~/model/inventory';

export const useAppStore = defineStore('app', {
    state: () => {
        return {
            isSidebarOpen: true,
            products: [] as ProductItem[],
            categories: [] as CategoryItem[],
            user: {} as any,
            currency: {
                currencyBase: 'USD',
                exchangeUSD: 1,
                exchangeKHR: 4100,
            }
        }
    },
    actions: {
        toggleSidebar() {
            this.isSidebarOpen = !this.isSidebarOpen
        },
        setProducts(products: ProductItem[]) {
            this.products = products;
        },
        setCategories(categories: CategoryItem[]) {
            this.categories = categories;
        },
        setUser(user: any) {
            this.user = user;
        },
        setCurrency(currency: { currencyBase: string; exchangeUSD: number; exchangeKHR: number }) {
            this.currency = currency;
        }
    },

    getters: {
        sidebarStatus: (state) => state.isSidebarOpen,
        allProducts: (state) => state.products,
        allCategories: (state) => state.categories,
        currentUser: (state) => state.user,
        currentCurrency: (state) => state.currency,
    }
});