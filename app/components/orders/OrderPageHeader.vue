<template>
  <section class="flex flex-col gap-4 rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-slate-200 lg:flex-row lg:items-end lg:justify-between">
    <div>
      <p class="text-sm font-semibold uppercase tracking-[0.24em] text-blue-600">Seller Orders</p>
      <h1 class="mt-2 text-3xl font-semibold text-slate-900">Order Management</h1>
      <p class="mt-2 text-sm text-slate-500">
        Review incoming guest orders, update fulfilment progress, and keep payment status in sync for {{ shopLabel }}.
      </p>
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  shopLabel: string;
}>();
</script>
