<template>
  <div
    class="flex min-h-screen items-center justify-center bg-[linear-gradient(180deg,#fff7ed_0%,#ffffff_100%)] px-4"
  >
    <section
      class="w-full max-w-xl rounded-4xl bg-white p-8 text-center shadow-sm ring-1 ring-amber-200"
    >
      <p
        class="text-sm font-semibold uppercase tracking-[0.24em] text-amber-700"
      >
        {{ $t("Order Received") }}
      </p>
      <h1 class="mt-4 font-serif text-4xl text-slate-900">{{ $t("Thank you") }}</h1>
      <p class="mt-4 text-sm leading-6 text-slate-600">
        {{ $t("Your order has been sent to the seller dashboard and is waiting for confirmation.") }}
      </p>
      <div class="mt-6 rounded-2xl bg-slate-950 px-5 py-4 text-slate-50">
        <p class="text-xs uppercase tracking-[0.2em] text-slate-400">
          {{ $t("Order number") }}
        </p>
        <p class="mt-2 text-2xl font-semibold">
          {{ orderNumber || $t("Pending") }}
        </p>
      </div>
      <div class="mt-8 flex justify-center gap-3">
        <NuxtLink
          to="/shop"
          class="rounded-full bg-amber-500 px-5 py-3 text-sm font-semibold text-slate-950"
        >
          {{ $t("Place another order") }}
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "guest",
});

const route = useRoute();
const orderNumber = computed(() => String(route.query.orderNumber ?? ""));
</script>
