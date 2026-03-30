<template>
  <div
    class="bg-white border border-gray-200 rounded-md h-[90dvh] overflow-auto flex flex-col"
  >
    <div
      class="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between p-2"
    >
      <div>
        <h2 class="text-lg font-semibold text-slate-900">{{ $t("Products") }}</h2>
        <div class="mt-2 flex flex-wrap gap-2">
          <el-tag size="small" round type="info">
            {{ categories.length }} {{ $t("categories") }}
          </el-tag>
          <el-tag size="small" round type="success">
            {{ products.length }} {{ $t("shown") }}
          </el-tag>
        </div>
      </div>

      <div class="flex w-full flex-col gap-2 lg:max-w-xl">
        <el-input
          :model-value="search"
          clearable
          :placeholder="$t('Search by name or SKU')"
          @update:model-value="emit('update:search', String($event ?? ''))"
        />

        <div class="flex flex-wrap gap-2">
          <el-button
            size="small"
            round
            :type="selectedCategoryId === 'all' ? 'primary' : 'default'"
            @click="emit('update:selectedCategoryId', 'all')"
          >
            {{ $t("All") }}
          </el-button>
          <el-button
            v-for="category in categories"
            :key="category.id"
            size="small"
            round
            :type="selectedCategoryId === category.id ? 'success' : 'default'"
            @click="emit('update:selectedCategoryId', category.id)"
          >
            {{ category.name }}
          </el-button>
          <el-button
            v-if="search || selectedCategoryId !== 'all'"
            size="small"
            text
            @click="resetFilters"
          >
            {{ $t("Reset") }}
          </el-button>
        </div>
      </div>
    </div>

    <div :loading="loading" class="h-[77dvh] overflow-auto p-2">
      <div
        v-if="products.length"
        class="grid grid-cols-2 md:grid-cols-4 2xl:grid-cols-4 gap-2"
      >
        <div
          v-for="product in products"
          :key="product.id"
          class="border p-2 rounded-md border-slate-300"
        >
          <div>
            <div class="product-photo">
              <div class="w-auto h-40">
                <img
                  :src="product.imageUrl || 'https://images.immediate.co.uk/production/volatile/sites/30/2020/08/iced-latte-30188f7.jpg'"
                  alt=""
                  class="w-full h-full object-cover rounded-md"
                >
              </div>
              <div class="mt-2 text-slate-500">
                <el-tag size="small" round type="danger">
                  {{ product.category?.name }}
                </el-tag>
              </div>
            </div>

            <div>
              <div class="text-md font-medium text-secondary mt-2">
                {{ product.name }}
              </div>
              <div class="flex justify-between text-[12px]">
                <p>{{ $t("Price") }}:</p>
                <div class="flex flex-col justify-end items-end">
                  <p>៛{{ Number(product.basePrice).toFixed(2) }}</p>
                  <p>{{ Number(product.basePrice).toFixed(2) }}</p>
                </div>
              </div>
            </div>
            <div class="w-full gap-2 mt-2">
              <el-button
                class="w-full"
                type="primary"
                :disabled="product.stock === 0"
                @click="emit('add', product)"
              >
                {{ $t("Add") }}
              </el-button>
            </div>
          </div>
        </div>
      </div>

      <el-empty v-else :description="$t('No products match the current filters.')" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CategoryItem, ProductItem } from "~/model/inventory";

defineProps<{
  loading: boolean;
  search: string;
  selectedCategoryId: number | "all";
  categories: CategoryItem[];
  products: ProductItem[];
}>();

const emit = defineEmits<{
  (event: "update:search", value: string): void;
  (event: "update:selectedCategoryId", value: number | "all"): void;
  (event: "add", value: ProductItem): void;
}>();

const resetFilters = () => {
  emit("update:search", "");
  emit("update:selectedCategoryId", "all");
};
</script>
