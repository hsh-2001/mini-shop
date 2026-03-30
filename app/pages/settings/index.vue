<template>
  <div class="w-full h-full">
    <el-card class="w-full h-full" shadow="never">
      <template #header>
        <div class="flex justify-between">
          <h2 class="text-xl font-bold">Settings</h2>
          <el-button type="primary" size="small">Edit</el-button>
        </div>
      </template>
      <div class="flex flex-col gap-4"></div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
const { getShopSetting } = useSetting();

onMounted(() => {
  getShopSetting();
});
</script>

<style scoped></style>
