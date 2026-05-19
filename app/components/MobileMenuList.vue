<template>
  <div
    v-if="store.isMobileMenuOpen"
    class="h-full bg-white text-slate-700 flex flex-col overflow-y-auto"
  >
    <!-- Brand / Shop Identity -->
    <div class="flex items-center gap-3 px-5 py-5 border-b border-slate-100 shrink-0">
      <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold text-sm">
        {{ shopInitial }}
      </div>
      <div class="flex flex-col min-w-0">
        <span class="text-sm font-semibold text-slate-900 truncate">{{ shopName }}</span>
        <span class="text-[11px] text-slate-400 uppercase tracking-wider">{{ $t(userRoleLabel) }}</span>
      </div>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 px-3 py-4 space-y-0.5">
      <template v-for="item in filteredMenus" :key="item.name">
        <div>
          <div
            class="group relative flex items-center justify-between w-full px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-200"
            :class="[
              isParentActive(item)
                ? 'bg-primary/10 text-primary font-medium'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100',
            ]"
            @click="handleClick(item)"
          >
            <!-- Active indicator bar -->
            <span
              v-if="isParentActive(item)"
              class="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-primary"
            />
            <div class="flex items-center gap-3 ml-1">
              <component
                v-if="item.icon"
                :is="item.icon"
                class="h-[18px] w-[18px] shrink-0 transition-colors duration-200"
                :class="isParentActive(item) ? 'text-primary' : 'text-slate-400'"
              />
              <span class="text-sm font-medium">{{ $t(item.name) }}</span>
            </div>
            <div
              v-if="item.children"
              class="transition-transform duration-200"
              :class="openMenus.includes(item.name) ? 'rotate-180' : ''"
            >
              <ChevronDown class="h-3.5 w-3.5 text-slate-400" />
            </div>
          </div>

          <!-- Submenu -->
          <transition name="accordion">
            <div
              v-if="item.children && openMenus.includes(item.name)"
              class="ml-4 mt-0.5 border-l border-slate-200 pl-2 space-y-0.5"
            >
              <div
                v-for="child in item.children"
                :key="child.name"
                @click="navigate(child.path)"
                class="group relative flex items-center gap-2.5 px-3 py-2 rounded-md text-sm cursor-pointer transition-all duration-200"
                :class="[
                  isActive(child.path)
                    ? 'text-primary font-medium'
                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50',
                ]"
              >
                <!-- Active dot -->
                <span
                  v-if="isActive(child.path)"
                  class="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-3 rounded-r-full bg-primary"
                />
                <span
                  class="h-1.5 w-1.5 rounded-full shrink-0 transition-colors duration-200"
                  :class="isActive(child.path) ? 'bg-primary' : 'bg-slate-300'"
                />
                {{ $t(child.name) }}
              </div>
            </div>
          </transition>
        </div>
      </template>
    </nav>

    <!-- User Section -->
    <div class="border-t border-slate-100 px-3 py-3 shrink-0">
      <div class="flex items-center gap-3 rounded-lg px-2 py-2">
        <div
          class="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-500 shrink-0"
        >
          {{ userInitials }}
        </div>
        <div class="flex flex-col min-w-0 flex-1">
          <span class="text-sm font-medium text-slate-800 truncate">{{ store.currentUser?.username || $t('User') }}</span>
          <span class="text-[10px] uppercase tracking-wider text-slate-400">{{ $t(userRoleLabel) }}</span>
        </div>
        <button
          class="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all duration-200"
          :title="$t('Logout')"
          @click="logOut"
        >
          <LogOut class="h-4 w-4" />
        </button>
      </div>
      <div class="mt-2 px-2">
        <ClientOnly>
          <el-select
            v-model="selectedLanguage"
            :placeholder="$t('Select')"
            size="small"
            class="w-full!"
          >
            <el-option
              v-for="item in languageOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </ClientOnly>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from "vue-router";
import { menuItems } from "~/constants/menuItem";
import { ChevronDown, LogOut } from "@lucide/vue";
import useNavbar from "~/composables/useNavbar";

const store = useAppStore();
const router = useRouter();
const route = useRoute();
const { logOut, selectedLanguage, languageOptions, currentUser } = useNavbar();

const userRole = ref(store.currentUser?.role || "USER");

const openMenus = ref<string[]>([]);

const filteredMenus = computed(() => {
  return menuItems
    .filter(
      (item) => !item.allowRoles || item.allowRoles.includes(userRole.value),
    )
    .map((item) => ({
      ...item,
      children: item.children?.filter(
        (child) =>
          !child.allowRoles || child.allowRoles.includes(userRole.value),
      ),
    }));
});

const { t } = useI18n();

const shopName = computed(() => {
  return currentUser?.shop?.name || currentUser?.username || t("Shop");
});

const shopInitial = computed(() => {
  return (shopName.value?.charAt(0) || "S").toUpperCase();
});

const userRoleLabel = computed(() => {
  return store.user?.role || currentUser?.role || "STAFF";
});

const userInitials = computed(() => {
  const name = currentUser?.username || "U";
  return name.charAt(0).toUpperCase();
});

const handleClick = (item: any) => {
  if (item.children) {
    openMenus.value.includes(item.name)
      ? (openMenus.value = openMenus.value.filter((i) => i !== item.name))
      : openMenus.value.push(item.name);
  } else if (item.path) {
    navigate(item.path);
  }
};

const navigate = (path?: string) => {
  if (!path) return;
  router.push(path);
  store.isMobileMenuOpen = false;
};

const isActive = (path?: string) => route.path === path;

const isParentActive = (item: any) => {
  if (item.path && route.path === item.path) return true;
  if (item.children) {
    return item.children.some((c: any) => c.path === route.path);
  }
  return false;
};
</script>

<style scoped>
.accordion-enter-active {
  transition: all 0.2s ease-out;
  overflow: hidden;
}
.accordion-leave-active {
  transition: all 0.2s ease-in;
  overflow: hidden;
}
.accordion-enter-from {
  opacity: 0;
  max-height: 0;
  transform: translateY(-6px);
}
.accordion-enter-to {
  opacity: 1;
  max-height: 400px;
  transform: translateY(0);
}
.accordion-leave-from {
  opacity: 1;
  max-height: 400px;
  transform: translateY(0);
}
.accordion-leave-to {
  opacity: 0;
  max-height: 0;
  transform: translateY(-6px);
}
</style>
