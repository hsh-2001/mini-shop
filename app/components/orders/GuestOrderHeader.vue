<template>
  <section class="overflow-hidden rounded-[28px] bg-linear-to-br from-amber-100 via-white to-orange-100 p-6 shadow-sm ring-1 ring-amber-200/70 lg:p-8">
    <div class="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
      <div class="space-y-4">
        <p class="text-sm font-semibold uppercase tracking-[0.25em] text-amber-700">
          {{ $t("Guest Ordering") }}
        </p>
        <div>
          <h1 class="font-serif text-3xl text-slate-900 lg:text-4xl">
            {{ shop?.name ?? $t("Shopfront") }}
          </h1>
          <p class="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            {{ shop?.description || $t("Browse the menu, add items to your cart, and send the order directly to the seller dashboard.") }}
          </p>
        </div>

        <div class="flex flex-wrap gap-3 text-sm text-slate-700">
          <div class="rounded-full bg-white/80 px-4 py-2 ring-1 ring-amber-200">
            {{ $t("Simple ordering") }}
          </div>
          <div class="rounded-full bg-white/80 px-4 py-2 ring-1 ring-amber-200">
            {{ $t("Live stock visibility") }}
          </div>
          <div class="rounded-full bg-white/80 px-4 py-2 ring-1 ring-amber-200">
            {{ $t("Direct to seller") }}
          </div>
        </div>
      </div>

      <div class="grid gap-3 text-sm text-slate-700 sm:grid-cols-2 lg:min-w-[360px]">
        <div class="rounded-2xl bg-white/85 px-4 py-4 ring-1 ring-slate-200 backdrop-blur">
          <p class="text-xs uppercase tracking-[0.2em] text-slate-500">{{ $t("Address") }}</p>
          <p class="mt-2 font-medium">{{ shop?.address || $t("Not provided") }}</p>
        </div>
        <div class="rounded-2xl bg-slate-900 px-4 py-4 text-slate-50 ring-1 ring-slate-900">
          <p class="text-xs uppercase tracking-[0.2em] text-slate-400">{{ $t("Phone") }}</p>
          <p class="mt-2 font-medium">{{ shop?.phone || $t("Contact in store") }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { CatalogShop } from "~/model/order";

defineProps<{
  shop: CatalogShop | null;
}>();
</script>
