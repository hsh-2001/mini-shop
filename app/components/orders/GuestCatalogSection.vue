<template>
  <section class="space-y-5 rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-slate-200">
    <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <h2 class="text-xl font-semibold text-slate-900">{{ $t("Menu") }}</h2>
        <p class="text-sm text-slate-500">{{ $t("Choose items for the guest order.") }}</p>
        <div class="mt-3 flex flex-wrap gap-2 text-xs font-medium text-slate-500">
          <span class="rounded-full bg-slate-100 px-3 py-1">{{ categories.length }} {{ $t("categories") }}</span>
          <span class="rounded-full bg-amber-50 px-3 py-1 text-amber-700">{{ products.length }} {{ $t("items shown") }}</span>
        </div>
      </div>

      <div class="flex flex-col gap-3 sm:flex-row">
        <el-input
          :model-value="search"
          :placeholder="$t('Search menu')"
          clearable
          class="w-full sm:w-64"
          @update:model-value="$emit('update:search', $event)"
        />
        <label class="relative block w-full sm:w-56">
          <span class="sr-only">{{ $t("Filter by category") }}</span>
          <select
            :value="selectedCategoryId"
            class="w-full appearance-none rounded-[14px] border border-slate-300 bg-white px-4 py-[11px] pr-10 text-sm text-slate-700 shadow-sm outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
            @change="$emit('update:selectedCategoryId', ($event.target as HTMLSelectElement).value === 'all' ? 'all' : Number(($event.target as HTMLSelectElement).value))"
          >
            <option value="all">{{ $t("All categories") }}</option>
            <option
            v-for="category in categories"
            :key="category.id"
            :value="category.id"
            >
              {{ category.name }}
            </option>
          </select>
          <span class="pointer-events-none absolute inset-y-0 right-4 flex items-center text-slate-400">
            ▾
          </span>
        </label>
      </div>
    </div>

    <el-skeleton :loading="loading" animated :rows="6">
      <template #default>
        <div
          v-if="products.length"
          class="grid gap-4 md:grid-cols-2 2xl:grid-cols-3"
        >
          <article
            v-for="product in products"
            :key="product.id"
            class="flex h-full flex-col rounded-3xl border border-slate-200 bg-linear-to-b from-white to-slate-50 p-5 transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div class="space-y-3">
              <div class="flex items-start justify-between gap-4">
                <div>
                  <p class="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">
                    {{ product.category?.name || $t("Menu Item") }}
                  </p>
                  <h3 class="mt-2 text-lg font-semibold text-slate-900">
                    {{ product.name }}
                  </h3>
                </div>
                <span class="rounded-full bg-white px-3 py-1 text-sm font-semibold text-slate-900 ring-1 ring-slate-200">
                  {{ formatMoney(Number(product.basePrice)) }}
                </span>
              </div>

              <p class="min-h-10 text-sm leading-6 text-slate-600">
                {{ product.description || $t("Freshly prepared and available for immediate ordering.") }}
              </p>
            </div>

            <div class="mt-5 flex items-center justify-between gap-3 text-sm text-slate-500">
              <span
                class="rounded-full px-3 py-1"
                :class="product.stock === 0 ? 'bg-rose-50 text-rose-600' : 'bg-slate-100 text-slate-600'"
              >
                {{ product.stock >= 0 ? `${$t("Stock")}: ${product.stock}` : $t("Always available") }}
              </span>
              <el-button
                type="warning"
                round
                :disabled="product.stock === 0"
                @click="$emit('add', product)"
              >
                {{ $t("Add to cart") }}
              </el-button>
            </div>
          </article>
        </div>
        <div
          v-else
          class="rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center text-sm text-slate-500"
        >
          <p class="font-medium text-slate-700">{{ $t("No products match the current filters.") }}</p>
          <p class="mt-2">{{ $t("Try another category or clear the search field.") }}</p>
        </div>
      </template>
    </el-skeleton>
  </section>
</template>

<script setup lang="ts">
import type { ProductCategorySummary } from "~/model/inventory";
import type { CatalogProductItem } from "~/model/order";
import { formatCurrency } from "~/utils/currencyFormat";

defineProps<{
  loading: boolean;
  search: string;
  selectedCategoryId: number | "all";
  categories: ProductCategorySummary[];
  products: CatalogProductItem[];
}>();

defineEmits<{
  (event: "update:search", value: string): void;
  (event: "update:selectedCategoryId", value: number | "all"): void;
  (event: "add", value: CatalogProductItem): void;
}>();

const store = useAppStore();
const formatMoney = (amount: number) =>
  formatCurrency(amount, store.currentCurrency.currencyBase || "USD");
</script>
