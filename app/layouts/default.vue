<template>
  <div class="h-screen flex flex-col bg-slate-100 text-slate-900">
    <AdminHeader />

    <div class="flex flex-1 overflow-hidden">
      <AdminSidebar />
      <div class="w-full">
        <div class="flex w-full h-full relative overflow-hidden">
          <div
            class="h-full w-full p-2 transition-transform duration-300 ease-in-out"
            :class="
              store.isMobileMenuOpen ? '-translate-x-[70%] overflow-hidden' : 'translate-x-0 overflow-y-auto'
            "
          >
            <div v-if="store.isMobileMenuOpen" @click="store.toggleMobileMenu" class="bg-slate-900/20 w-full h-full inset-0 absolute z-10"></div>
            <slot />
          </div>
          <div
            class="w-[70%] h-full absolute right-0 top-0 transition-transform duration-300 ease-in-out"
            :class="
              store.isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
            "
          >
            <MobileMenuList />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import AdminSidebar from "~/components/AdminSidebar.vue";
import AdminHeader from "~/components/AdminHeader.client.vue";
import MobileMenuList from "~/components/MobileMenuList.vue";

const store = useAppStore();
</script>
