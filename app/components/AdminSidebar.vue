<template>
  <Transition name="sidebar">
    <div
      v-if="store.isSidebarOpen"
      class="sidebar w-52 h-[calc(100dvh-40px)] text-slate-700 bg-gray-50 border-r text-sm border-slate-300 relative"
    >
      <div class="w-full py-4 flex items-center justify-center">
        <h1 class="text-lg font-medium">Admin Sidebar</h1>
      </div>

      <div>
        <ul v-for="(menu, index) in menuItems" :key="menu.name">
          <li
            class="px-2 flex justify-between items-center"
            @click="toggleMenu(index)"
          >
            <NuxtLink
              :to="menu.path"
              class="flex items-center gap-2 w-full py-2"
              :class="{
                'text-blue-500 bg-blue-300/10 rounded-lg':
                  currentPath === menu.path,
              }"
            >
              <component :is="menu.icon" class="h-4 w-4" />
              {{ $t(menu.name) }}
            </NuxtLink>

            <ChevronRight
              v-if="menu.children"
              class="h-4 w-4 text-slate-500 transition-transform duration-300"
              :class="{ 'rotate-90': currentExpanded === index }"
            />
          </li>
          <Transition name="submenu">
            <ul
              v-if="menu.children && currentExpanded === index"
              class="border-l border-slate-100 px-2 overflow-hidden"
            >
              <li
                v-for="sub in menu.children"
                :key="sub.name"
                class="transition-all duration-200"
              >
                <NuxtLink
                  :to="sub.path"
                  class="flex items-center gap-2 px-4 py-2.5 text-[12px] rounded-md hover:text-blue-600 transition-all"
                  :class="{
                    'bg-blue-100 text-blue-700 font-medium':
                      currentPath === sub.path,
                  }"
                >
                  {{ $t(sub.name) }}
                </NuxtLink>
              </li>
            </ul>
          </Transition>
        </ul>
      </div>

      <button
        class="rounded-full p-1 bg-white absolute border border-gray-200 top-2 -right-3"
        @click="toggleSidebar"
      >
        <ChevronLeft class="h-4 w-4" />
      </button>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ChevronLeft, ChevronRight } from "@lucide/vue";
import { menuItems } from "~/constants/menuItem";

const store = useAppStore();
const { toggleSidebar } = store;

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
</script>

<style scoped>
.sidebar-enter-from {
  transform: translateX(-100%);
  opacity: 0;
}

.sidebar-enter-to {
  transform: translateX(0);
  opacity: 1;
}

.sidebar-enter-active {
  transition: all 0.3s ease;
}

/* LEAVE */
.sidebar-leave-from {
  transform: translateX(0);
  opacity: 1;
}

.sidebar-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}

.sidebar-leave-active {
  transition: all 0.3s ease;
}

.submenu-enter-from {
  opacity: 0;
  max-height: 0;
  transform: translateY(-10px);
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
  transform: translateY(-10px);
}

.submenu-leave-active {
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}
</style>
