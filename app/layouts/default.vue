<template>
  <div class="h-screen flex flex-col bg-slate-100 text-slate-900">
    <AdminHeader />

    <div class="flex w-full h-full overflow-hidden">
      <AdminSidebar />

      <div class="flex-1 relative">
        <div class="w-full h-full relative overflow-hidden">
          <div
            class="absolute inset-0 h-full transition-transform duration-300 ease-in-out bg-white"
            :class="
              store.isMobileMenuOpen ? '-translate-x-[70%]' : 'translate-x-0'
            "
          >
            <div
              v-if="store.isMobileMenuOpen"
              @click="store.toggleMobileMenu"
              class="absolute inset-0 bg-black/30 z-10"
            ></div>

            <div class="h-full overflow-y-auto relative z-0" :class="isMobile ? 'p-2' : 'p-4'">
              <slot />
            </div>
          </div>

          <div
            class="absolute top-0 right-0 h-full w-[70%] bg-white shadow-xl transition-transform duration-300 ease-in-out z-20"
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
const { isMobile } = deviceHelper();
</script>
