<template>
  <Transition name="sidebar">
    <div
      v-if="store.isSidebarOpen && !isMobile"
      class="sidebar w-56 h-[calc(100dvh-40px)] bg-white text-slate-700 flex flex-col relative shrink-0 border-r border-slate-200"
    >
      <!-- Brand / Shop Identity -->
      <div class="flex items-center gap-3 px-5 py-5 border-b border-slate-100">
        <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold text-sm">
          {{ shopInitial }}
        </div>
        <div class="flex flex-col min-w-0">
          <span class="text-sm font-semibold text-slate-900 truncate">{{ shopName }}</span>
          <span class="text-[11px] text-slate-400 uppercase tracking-wider">{{ $t(userRoleLabel) }}</span>
        </div>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 overflow-y-auto px-3 py-4 space-y-0.5 scrollbar-thin">
        <ul v-for="(menu, index) in filterMenuItems" :key="menu.name" class="space-y-0.5">
          <li>
            <NuxtLink
              :to="menu.path || '#'"
              class="group relative flex items-center gap-3 w-full px-3 py-2.5 rounded-lg transition-all duration-200"
              :class="[
                isParentActive(menu)
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100',
              ]"
              @click.prevent="menu.children ? toggleMenu(index) : undefined"
            >
              <!-- Active indicator bar -->
              <span
                v-if="isParentActive(menu)"
                class="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-primary"
              />
              <!-- Icon -->
              <component
                :is="menu.icon"
                class="h-[18px] w-[18px] shrink-0 transition-colors duration-200"
                :class="isParentActive(menu) ? 'text-primary' : 'text-slate-400 group-hover:text-slate-600'"
              />
              <!-- Label -->
              <span class="text-sm flex-1 truncate">{{ $t(menu.name) }}</span>
              <!-- Chevron for submenus -->
              <ChevronRight
                v-if="menu.children"
                class="h-3.5 w-3.5 text-slate-400 transition-transform duration-200"
                :class="{ 'rotate-90': currentExpanded === index }"
              />
          </NuxtLink>

            <!-- Submenu -->
            <Transition name="submenu">
              <ul
                v-if="menu.children && currentExpanded === index"
                class="mt-0.5 ml-4 border-l border-slate-200 pl-2 space-y-0.5"
              >
                <li
                  v-for="sub in menu.children"
                  :key="sub.name"
                >
                  <NuxtLink
                    :to="sub.path || '#'"
                    class="group relative flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-all duration-200"
                    :class="[
                      currentPath === sub.path
                        ? 'text-primary font-medium'
                        : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50',
                    ]"
                  >
                    <!-- Active dot -->
                    <span
                      v-if="currentPath === sub.path"
                      class="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-3 rounded-r-full bg-primary"
                    />
                    <span
                      class="h-1.5 w-1.5 rounded-full shrink-0 transition-colors duration-200"
                      :class="currentPath === sub.path ? 'bg-primary' : 'bg-slate-300 group-hover:bg-slate-400'"
                    />
                    {{ $t(sub.name) }}
                  </NuxtLink>
                </li>
              </ul>
            </Transition>
          </li>
        </ul>
      </nav>

      <!-- User Section -->
      <div class="border-t border-slate-100 px-3 py-3">
        <div class="flex items-center gap-3 rounded-lg px-2 py-2">
          <div
            class="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-500 shrink-0"
          >
            {{ userInitials }}
          </div>
          <div class="flex flex-col min-w-0 flex-1">
            <span class="text-sm font-medium text-slate-800 truncate">{{ currentUser.username || $t('User') }}</span>
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
      </div>

      <!-- Collapse Toggle -->
      <button
        class="absolute -right-3 top-12 flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-400 hover:text-slate-600 hover:border-slate-300 transition-all duration-200 shadow-sm"
        @click="toggleSidebar"
        :title="$t('Collapse sidebar')"
      >
        <ChevronLeft class="h-3.5 w-3.5" />
      </button>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ChevronLeft, ChevronRight, LogOut } from "@lucide/vue";
import useNavbar from "~/composables/useNavbar";
import deviceHelper from "~/utils/deviceHelper";

const { filterMenuItems, logOut } = useNavbar();
const store = useAppStore();
const { toggleSidebar, currentUser } = store;
const { isMobile } = deviceHelper();
const { t } = useI18n();

const route = useRoute();
const currentPath = computed(() => route.path);

const currentExpanded = ref<number | null>(null);

const toggleMenu = (index: number) => {
  if (currentExpanded.value === index) {
    currentExpanded.value = null;
  } else {
    currentExpanded.value = index;
  }
};

const isParentActive = (item: any) => {
  if (item.path && currentPath.value === item.path) return true;
  if (item.children) {
    return item.children.some((c: any) => c.path === currentPath.value);
  }
  return false;
};

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

const screenWidth = ref(window.innerWidth);
window.addEventListener("resize", () => {
  screenWidth.value = window.innerWidth;
});

watch(
  screenWidth,
  (newWidth) => {
    if (newWidth < 1000) {
      store.isSidebarOpen = false;
    } else {
      store.isSidebarOpen = true;
    }
  },
  { deep: true, immediate: true },
);
</script>

<style scoped>
/* Custom thin scrollbar */
.scrollbar-thin::-webkit-scrollbar {
  width: 3px;
}
.scrollbar-thin::-webkit-scrollbar-track {
  background: transparent;
}
.scrollbar-thin::-webkit-scrollbar-thumb {
  background: rgba(148, 163, 184, 0.3);
  border-radius: 10px;
}
.scrollbar-thin::-webkit-scrollbar-thumb:hover {
  background: rgba(148, 163, 184, 0.5);
}

/* Sidebar enter/leave */
.sidebar-enter-from {
  transform: translateX(-100%);
  opacity: 0;
}
.sidebar-enter-to {
  transform: translateX(0);
  opacity: 1;
}
.sidebar-enter-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.sidebar-leave-from {
  transform: translateX(0);
  opacity: 1;
}
.sidebar-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}
.sidebar-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: absolute;
}

/* Submenu expand/collapse */
.submenu-enter-from {
  opacity: 0;
  max-height: 0;
  transform: translateY(-8px);
}
.submenu-enter-to {
  opacity: 1;
  max-height: 400px;
  transform: translateY(0);
}
.submenu-enter-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}
.submenu-leave-from {
  opacity: 1;
  max-height: 400px;
  transform: translateY(0);
}
.submenu-leave-to {
  opacity: 0;
  max-height: 0;
  transform: translateY(-8px);
}
.submenu-leave-active {
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}
</style>
