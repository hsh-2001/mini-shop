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
      <el-popover
        placement="bottom"
        :width="300"
        trigger="click"
        popper-class="notification-popover"
      >
        <template #reference>
          <button class="mr-4 relative">
            <span
              v-if="totalNotifications > 0"
              class="absolute text-[10px] -top-1 -right-2 bg-red-400 text-white rounded-full px-1"
            >
              {{ totalNotifications }}
            </span>
            <Bell class="h-6 w-6 text-primary/60" />
          </button>
        </template>
        <div class="notification-panel">
          <div class="font-semibold text-[14px] border-b pb-2 mb-2">
            {{ $t("Notifications") }}
          </div>
          <div class="grid gap-1.5">
            <NuxtLink
              to="/orders?notif=pending"
              class="flex items-center justify-between rounded-md px-2 py-2 hover:bg-amber-50 transition-colors"
            >
              <div class="flex items-center gap-2">
                <div class="flex h-7 w-7 items-center justify-center rounded-full bg-amber-100">
                  <Clock class="h-4 w-4 text-amber-600" />
                </div>
                <div>
                  <p class="text-[12px] font-medium text-gray-800">
                    {{ $t("Pending Orders") }}
                  </p>
                  <p class="text-[11px] text-gray-500">
                    {{ $t("Awaiting confirmation or preparation") }}
                  </p>
                </div>
              </div>
              <span
                v-if="notifications.pendingOrder > 0"
                class="text-[12px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full"
              >
                {{ notifications.pendingOrder }}
              </span>
              <span v-else class="text-[11px] text-gray-400">0</span>
            </NuxtLink>
            <NuxtLink
              to="/orders?notif=unpaid"
              class="flex items-center justify-between rounded-md px-2 py-2 hover:bg-red-50 transition-colors"
            >
              <div class="flex items-center gap-2">
                <div class="flex h-7 w-7 items-center justify-center rounded-full bg-red-100">
                  <DollarSign class="h-4 w-4 text-red-600" />
                </div>
                <div>
                  <p class="text-[12px] font-medium text-gray-800">
                    {{ $t("Unpaid Payments") }}
                  </p>
                  <p class="text-[11px] text-gray-500">
                    {{ $t("Orders not yet paid") }}
                  </p>
                </div>
              </div>
              <span
                v-if="notifications.pendingPayment > 0"
                class="text-[12px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full"
              >
                {{ notifications.pendingPayment }}
              </span>
              <span v-else class="text-[11px] text-gray-400">0</span>
            </NuxtLink>
          </div>
          <div class="border-t mt-2 pt-2">
            <NuxtLink
              to="/orders"
              class="flex items-center justify-center gap-1 text-[12px] text-blue-600 hover:text-blue-700 py-1 transition-colors"
            >
              {{ $t("View All Orders") }}
              <ArrowRight class="h-3.5 w-3.5" />
            </NuxtLink>
          </div>
        </div>
      </el-popover>
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
import {
  Menu,
  ChevronLeft,
  LogOut,
  MenuIcon,
  X,
  Bell,
  Clock,
  DollarSign,
  ArrowRight,
} from "@lucide/vue";
const { selectedLanguage, logOut, languageOptions, currentUser } = useNavbar();
const { t } = useI18n();

const store = useAppStore();
const headerLabel = computed(
  () => currentUser.shop?.name || t("Admin Dashboard"),
);
const { isMobile } = deviceHelper();

const { getNotification, notifications, startPolling } = useNotification();

const totalNotifications = computed(
  () => notifications.value.pendingOrder + notifications.value.pendingPayment,
);

onMounted(() => {
  getNotification();
  startPolling();
});
</script>

<style scoped></style>
