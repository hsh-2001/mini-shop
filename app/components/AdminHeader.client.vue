<template>
  <div
    class="flex w-full justify-between h-10 items-center bg-white shadow sticky top-0 z-10"
  >
    <div class="flex gap-2 items-center px-4 text-lg font-bold text-gray-800">
      <button
        v-if="!isMobile"
        @click="() => (store.isSidebarOpen = !store.isSidebarOpen)"
        class="rounded-full p-1 bg-white border border-gray-200"
      >
        <ChevronLeft v-if="store.isSidebarOpen" class="h-4 w-4" />
        <Menu v-else class="h-4 w-4" />
      </button>
      {{ headerLabel }}
    </div>
    <div class="mr-2 flex items-center">
      <el-tooltip
        effect="light"
        :content="$t('Notifications')"
        placement="bottom"
      >
        <template #content>
          <div class="font-medium mb-2 text-[14px]">
            {{ $t("Notifications") }}
          </div>
          <div class="grid gap-2 text-[12px]">
            <NuxtLink to="#" class="hover:text-blue-400">
              {{ $t("Pending Customer Orders") }}:
              {{ notifications.peddingOrder }}
            </NuxtLink>
            <NuxtLink to="#" class="hover:text-blue-400">
              {{ $t("Pending Customer Payments") }}:
              {{ notifications.peddingPayment }}
            </NuxtLink>
          </div>
        </template>
        <button class="mr-4 relative">
          <span
            class="absolute text-[10px] -top-1 -right-2 bg-red-400 text-white rounded-full px-1"
            >{{
              notifications.peddingOrder + notifications.peddingPayment
            }}</span
          >
          <Bell class="h-6 w-6 text-primary/60" />
        </button>
      </el-tooltip>
      <template v-if="!isMobile">
        <ClientOnly>
          <el-select
            size="small"
            v-model="selectedLanguage"
            :placeholder="$t('Select')"
            style="width: 80px"
          >
            <el-option
              v-for="item in languageOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </ClientOnly>
        <el-button size="small" type="danger" class="ml-2" @click="logOut">
          <LogOut class="h-4 w-4 mr-1" />
          {{ $t("Logout") }}
        </el-button>
      </template>
      <template v-else>
        <button @click="store.toggleMobileMenu">
          <X v-if="store.isMobileMenuOpen" class="h-6 w-6" />
          <MenuIcon v-else class="h-6 w-6" />
        </button>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Menu, ChevronLeft, LogOut, MenuIcon, X, Bell } from "@lucide/vue";
const { selectedLanguage, logOut, languageOptions, currentUser } = useNavbar();
const { t } = useI18n();

const store = useAppStore();
const headerLabel = computed(
  () => currentUser.shop?.name || t("Admin Dashboard"),
);
const { isMobile } = deviceHelper();

const { getNotification, notifications } = useNotification();

onMounted(() => {
  getNotification();
});
</script>

<style scoped></style>
