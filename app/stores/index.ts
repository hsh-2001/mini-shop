import { defineStore } from 'pinia'
import type { CategoryItem, ProductItem } from '~/model/inventory';

export const useAppStore = defineStore('app', {
    state: () => {
        return {
            isSidebarOpen: true,
            products: [] as ProductItem[],
            categories: [] as CategoryItem[],
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
        }
    },

    getters: {
        sidebarStatus: (state) => state.isSidebarOpen,
        allProducts: (state) => state.products,
        allCategories: (state) => state.categories,
    }
});