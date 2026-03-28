<template>
    <div class="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
            <p class="text-sm uppercase tracking-[0.2em] text-slate-500">{{ $t("Catalog") }}</p>
            <h1 class="text-3xl font-semibold text-slate-900">{{ $t("Product List") }}</h1>
            <p class="text-sm text-slate-500">{{ $t("Manage products and keep them mapped to categories.") }}</p>
        </div>
        <div class="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-sm">
            <span class="font-medium text-slate-900">{{ shopLabel }}</span>
        </div>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    shopLabel: string;
}>();
</script>
