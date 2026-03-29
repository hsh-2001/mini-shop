<template>
  <section
    class="overflow-hidden rounded-[32px] border border-slate-200 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.12),_transparent_38%),linear-gradient(135deg,_#ffffff,_#f8fafc_55%,_#eff6ff)] p-6 shadow-sm"
  >
    <div class="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <p class="text-sm font-semibold uppercase tracking-[0.24em] text-blue-600">{{ $t("Seller Orders") }}</p>
        <h1 class="mt-2 text-3xl font-semibold text-slate-900">{{ $t("Order Management") }}</h1>
        <p class="mt-2 text-sm text-slate-500">
          {{ $t("Review incoming guest orders, update fulfilment progress, and keep payment status in sync for") }}
          {{ shopLabel }}.
        </p>
      </div>
      <div class="grid gap-3 sm:grid-cols-2">
        <div class="rounded-2xl border border-white/70 bg-white/80 px-4 py-3 backdrop-blur">
          <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{{ $t("Workflow") }}</p>
          <p class="mt-2 text-sm font-medium text-slate-900">{{ $t("Fast triage for new and active orders") }}</p>
        </div>
        <div class="rounded-2xl border border-white/70 bg-slate-950 px-4 py-3 text-white">
          <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">{{ $t("Shop") }}</p>
          <p class="mt-2 text-sm font-medium">{{ shopLabel }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  shopLabel: string;
}>();
</script>
