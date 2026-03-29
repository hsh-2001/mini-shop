<template>
  <div v-if="isFinished" class="w-full min-h-screen bg-slate-100 text-slate-900">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
  <div v-else class="w-full min-h-screen flex items-center justify-center">
    <RefreshCcw  class=" animate-spin w-10 h-10 text-blue-500"/>
  </div>
</template>

<script lang="ts" setup>
import { RefreshCcw } from '@lucide/vue';
const { getAllProducts, getAllCategories } = useInitClientSide();

const isFinished = ref(false);

onMounted(async () => {
  await Promise.all([getAllProducts(), getAllCategories()]);
  setTimeout(() => {
    isFinished.value = true;
  }, 500);
});
</script>
