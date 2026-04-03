<template>
  <div
    class="p-4 bg-gray-50 rounded-md flex items-center justify-between border border-primary/20"
  >
    <div>
      <icon class="text-primary h-10 w-10" />
    </div>
    <div class="space-y-2">
      <h1 class="text-xl">{{$t(title) }}</h1>
      <p class="text-2xl font-bold text-end">
        {{ value }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
  value: string | number;
  icon: Component;
}>();
</script>

<style scoped></style>
