import { defineStore } from 'pinia'
import type { CategoryItem, ProductItem } from '~/model/inventory';

export const useAppStore = defineStore('app', {
    state: () => {
        return {
            isSidebarOpen: true,
            products: [] as ProductItem[],
            categories: [] as CategoryItem[],
            user: {} as any,
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
        }
    },

    getters: {
        sidebarStatus: (state) => state.isSidebarOpen,
        allProducts: (state) => state.products,
        allCategories: (state) => state.categories,
        currentUser: (state) => state.user,
    }
});