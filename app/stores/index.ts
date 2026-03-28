import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
    state: () => {
        return {
            isSidebarOpen: true,
        }
    },
    actions: {
        toggleSidebar() {
            this.isSidebarOpen = !this.isSidebarOpen
        },
    },

    getters: {
        sidebarStatus: (state) => state.isSidebarOpen,
    }
});