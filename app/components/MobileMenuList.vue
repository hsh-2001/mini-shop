<template>
  <div
    v-if="store.isMobileMenuOpen"
    class="h-full bg-white/95 backdrop-blur-md shadow-2xl p-4 overflow-y-auto relative"
  >
    <div class="mb-2 flex items-center justify-between">
      <h2 class="text-lg font-semibold tracking-tight">Menu</h2>
    </div>
    <div class="space-y-2">
      <template v-for="item in filteredMenus" :key="item.name">
        <div>
          <div
            class="group flex items-center justify-between px-3 py-3 rounded-md cursor-pointer transition-all duration-200"
            :class="[
              isParentActive(item)
                ? 'bg-primary/10 text-primary shadow-md'
                : 'hover:bg-gray-100',
            ]"
            @click="handleClick(item)"
          >
            <div class="flex items-center gap-3">
              <component
                v-if="item.icon"
                :is="item.icon"
                class="w-5 h-5 opacity-80 group-hover:opacity-100"
              />
              <span class="text-sm font-medium">
                {{ item.name }}
              </span>
            </div>
            <div
              v-if="item.children"
              class="transition-transform duration-300"
              :class="openMenus.includes(item.name) ? 'rotate-180' : ''"
            >
              <ChevronDown class="w-4 h-4 opacity-50" />
            </div>
          </div>

          <transition name="accordion">
            <div
              v-if="item.children && openMenus.includes(item.name)"
              class="ml-4 mt-1 space-y-1"
            >
              <div
                v-for="child in item.children"
                :key="child.name"
                @click="navigate(child.path)"
                class="px-3 py-2 rounded-md text-sm cursor-pointer transition-all duration-200 flex items-center justify-between"
                :class="[
                  isActive(child.path)
                    ? 'bg-primary/70 text-white shadow'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-black',
                ]"
              >
                {{ child.name }}

                <span
                  v-if="isActive(child.path)"
                  class="w-2 h-2 bg-white rounded-full"
                />
              </div>
            </div>
          </transition>
        </div>
      </template>
    </div>
    <div class="mt-4 pt-4 flex gap-1 border-t border-primary/50">
      <ClientOnly>
        <el-select v-model="selectedLanguage" :placeholder="$t('Select')">
          <el-option
            v-for="item in languageOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </ClientOnly>
      <el-button type="danger" class="w-full!" @click="logOut">
        <LogOut class="w-4 h-4" />
        {{ $t("Logout") }}
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from "vue-router";
import { menuItems } from "~/constants/menuItem";
import { ChevronDown } from "@lucide/vue";

const store = useAppStore();
const router = useRouter();
const route = useRoute();
const { logOut, selectedLanguage, languageOptions } = useNavbar();

const userRole = ref(store.currentUser?.role || "USER");

const openMenus = ref<string[]>([]);

const filteredMenus = computed(() => {
  return menuItems
    .filter(
      (item) =>
        !item.allowRoles || item.allowRoles.includes(userRole.value),
    )
    .map((item) => ({
      ...item,
      children: item.children?.filter(
        (child) =>
          !child.allowRoles || child.allowRoles.includes(userRole.value),
      ),
    }));
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
.accordion-enter-active,
.accordion-leave-active {
  transition: all 0.25s ease;
}
.accordion-enter-from,
.accordion-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
