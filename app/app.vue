<template>
  <div
    v-if="isFinished"
    class="w-full min-h-screen bg-slate-100 text-slate-900"
  >
    <ClientOnly>
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </ClientOnly>
  </div>
  <div v-else class="w-full min-h-screen flex items-center justify-center">
    <RefreshCcw class="animate-spin w-10 h-10 text-primary" />
  </div>
</template>

<script lang="ts" setup>
import { RefreshCcw } from "@lucide/vue";
const { getAllProducts, getAllCategories } = useInitClientSide();
const {  getShopSetting } = useSetting();

const isFinished = ref(false);

onBeforeMount(async () => {
  await Promise.all([getAllProducts(), getAllCategories(), getShopSetting()]);
  isFinished.value = true;
});

</script>
