<template>
  <div class="w-full min-h-screen bg-slate-100 text-slate-900">
   <NuxtLayout>
      <NuxtPage />
   </NuxtLayout>
  </div>
</template>

<script lang="ts" setup>
const {
  getAllProducts,
  getAllCategories
}  = useInitClientSide();

onMounted(async () => {
  await Promise.all([
    getAllProducts(),
    getAllCategories()
  ]);
});
</script>
