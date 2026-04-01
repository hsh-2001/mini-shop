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
    <div class="mr-2">
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
    </div>
  </div>
</template>

<script setup lang="ts">
import { Menu, ChevronLeft, LogOut } from "@lucide/vue";
const { selectedLanguage, logOut, languageOptions, currentUser } = useNavbar();
const { t } = useI18n();

const store = useAppStore();
const headerLabel = computed(
  () => currentUser.shop?.name || t("Admin Dashboard"),
);
const { isMobile } = deviceHelper();
</script>

<style scoped></style>
