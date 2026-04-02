<template>
  <div
    v-if="isFinished"
    class="w-full min-h-screen bg-slate-100 text-slate-900"
  >
    <ClientOnly>
      <ElConfigProvider :locale="elementLocale">
        <NuxtLayout>
          <NuxtPage />
        </NuxtLayout>
      </ElConfigProvider>
    </ClientOnly>
  </div>
  <div v-else class="w-full min-h-screen flex items-center justify-center">
    <RefreshCcw class="animate-spin w-10 h-10 text-primary" />
  </div>
</template>

<script lang="ts" setup>
import { ElConfigProvider } from "element-plus";
import en from "element-plus/es/locale/lang/en";
import km from "~/assets/element-kh";
import { RefreshCcw } from "@lucide/vue";
const { getAllProducts, getAllCategories } = useInitClientSide();
const { getShopSetting } = useSetting();

const isFinished = ref(false);

onBeforeMount(async () => {
  const token = useCookie("session_token").value;
  if (token) {
    await Promise.all([getAllProducts(), getAllCategories(), getShopSetting()]);
  }
  isFinished.value = true;
});

const { locale } = useI18n();

const elementLocale = computed(() => {
  const map: Record<string, any> = {
    en,
    km,
  };
  return map[locale.value] || en;
});
</script>
