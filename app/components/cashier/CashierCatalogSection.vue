<template>
  <el-card shadow="never" class="cashier-surface border-0">
    <div class="flex flex-col gap-4">
      <div
        class="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between"
      >
        <div>
          <h2 class="text-lg font-semibold text-slate-900">Products</h2>
          <p class="mt-1 text-sm text-slate-500">
            Compact catalog for fast cashier entry.
          </p>
          <div class="mt-2 flex flex-wrap gap-2">
            <el-tag size="small" round type="info">
              {{ categories.length }} categories
            </el-tag>
            <el-tag size="small" round type="success">
              {{ products.length }} shown
            </el-tag>
          </div>
        </div>

        <div class="flex w-full flex-col gap-3 lg:max-w-xl">
          <el-input
            :model-value="search"
            size="small"
            clearable
            placeholder="Search by name or SKU"
            @update:model-value="emit('update:search', String($event ?? ''))"
          />

          <div class="flex flex-wrap gap-2">
            <el-button
              size="small"
              round
              :type="selectedCategoryId === 'all' ? 'primary' : 'default'"
              @click="emit('update:selectedCategoryId', 'all')"
            >
              All
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
              Reset
            </el-button>
          </div>
        </div>
      </div>

      <el-skeleton :loading="loading" animated :rows="6">
        <template #template>
          <div class="grid gap-3 md:grid-cols-2 2xl:grid-cols-3">
            <div
              v-for="index in 6"
              :key="index"
              class="rounded-2xl border border-slate-200 bg-slate-50 p-4"
            >
              <div class="space-y-3">
                <el-skeleton-item variant="text" style="width: 40%" />
                <el-skeleton-item variant="text" style="width: 68%" />
                <el-skeleton-item variant="text" style="width: 84%" />
                <div class="flex justify-between pt-2">
                  <el-skeleton-item
                    variant="button"
                    style="width: 88px; height: 24px"
                  />
                  <el-skeleton-item
                    variant="button"
                    style="width: 88px; height: 28px"
                  />
                </div>
              </div>
            </div>
          </div>
        </template>

        <div
          v-if="products.length"
          class="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
        >
          <el-card
            v-for="product in products"
            :key="product.id"
            shadow="hover"
            class="product-card border-0"
            body-class="!p-0"
          >
            <div class="product-card__body">
              <div class="product-photo" :class="photoToneClass(product)">
                <component
                  :is="productIcon(product)"
                  class="h-12 w-12 text-white/90"
                  stroke-width="1.75"
                />
                <div class="product-photo__glow" />
                <div class="product-photo__label">
                  {{ product.category?.name || "Menu item" }}
                </div>
              </div>

              <div class="mt-3 flex items-start justify-between gap-3">
                <div class="min-w-0">
                  <h3 class="truncate text-[13px] font-semibold text-slate-900">
                    {{ product.name }}
                  </h3>
                  <p
                    class="mt-1 line-clamp-2 min-h-8 text-[11px] leading-4 text-slate-500"
                  >
                    {{
                      product.description ||
                      "Freshly prepared for fast coffee shop ordering."
                    }}
                  </p>
                </div>
                <div class="text-right">
                  <div class="text-sm font-semibold text-slate-900">
                    ${{ Number(product.basePrice).toFixed(2) }}
                  </div>
                  <div
                    v-if="product.sku"
                    class="mt-1 text-[11px] text-slate-400"
                  >
                    {{ product.sku }}
                  </div>
                </div>
              </div>

              <div class="mt-3 flex items-center justify-between gap-2">
                <div class="flex flex-wrap gap-2">
                  <el-tag
                    size="small"
                    :type="product.stock === 0 ? 'danger' : 'info'"
                    effect="plain"
                    round
                  >
                    {{
                      product.stock >= 0
                        ? `Stock ${product.stock}`
                        : "Available"
                    }}
                  </el-tag>
                  <el-tag size="small" type="warning" effect="plain" round>
                    Coffee shop
                  </el-tag>
                </div>
                <el-button
                  size="small"
                  type="success"
                  round
                  :disabled="product.stock === 0"
                  @click="emit('add', product)"
                >
                  Add
                </el-button>
              </div>
            </div>
          </el-card>
        </div>

        <el-empty v-else description="No products match the current filters." />
      </el-skeleton>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { Bean, Coffee, Cookie, Croissant, CupSoda, Milk } from "@lucide/vue";
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

const productIcon = (product: ProductItem) => {
  const category =
    `${product.category?.name ?? ""} ${product.name}`.toLowerCase();

  if (
    category.includes("croissant") ||
    category.includes("pastry") ||
    category.includes("bakery")
  ) {
    return Croissant;
  }

  if (category.includes("cookie") || category.includes("biscuit")) {
    return Cookie;
  }

  if (
    category.includes("milk") ||
    category.includes("latte") ||
    category.includes("cream")
  ) {
    return Milk;
  }

  if (
    category.includes("tea") ||
    category.includes("iced") ||
    category.includes("soda") ||
    category.includes("frappe")
  ) {
    return CupSoda;
  }

  if (category.includes("bean") || category.includes("espresso")) {
    return Bean;
  }

  return Coffee;
};

const photoToneClass = (product: ProductItem) => {
  const category =
    `${product.category?.name ?? ""} ${product.name}`.toLowerCase();

  if (
    category.includes("croissant") ||
    category.includes("pastry") ||
    category.includes("cookie")
  ) {
    return "product-photo--pastry";
  }

  if (
    category.includes("tea") ||
    category.includes("iced") ||
    category.includes("soda") ||
    category.includes("frappe")
  ) {
    return "product-photo--cold";
  }

  if (category.includes("milk") || category.includes("latte")) {
    return "product-photo--milk";
  }

  return "product-photo--coffee";
};
</script>

<style scoped>
.cashier-surface :deep(.el-card__body) {
  padding: 16px;
}

.cashier-surface :deep(.el-input__wrapper),
.cashier-surface :deep(.el-button),
.cashier-surface :deep(.el-tag),
.cashier-surface :deep(.el-card),
.cashier-surface :deep(.el-empty__image) {
  border-radius: 0;
}

.product-card :deep(.el-card__body) {
  height: 100%;
}

.product-card__body {
  height: 100%;
  padding: 10px;
  border: 1px solid rgb(226 232 240);
  background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
}

.product-photo {
  position: relative;
  display: flex;
  height: 92px;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border: 1px solid rgb(226 232 240);
  background: linear-gradient(135deg, #c08457 0%, #6f4e37 100%);
}

.product-photo--coffee {
  background:
    radial-gradient(circle at top, rgb(255 237 213 / 0.45), transparent 32%),
    linear-gradient(135deg, #a16207 0%, #6f4e37 52%, #292524 100%);
}

.product-photo--cold {
  background:
    radial-gradient(circle at top, rgb(255 255 255 / 0.32), transparent 28%),
    linear-gradient(135deg, #0f766e 0%, #0891b2 45%, #1e293b 100%);
}

.product-photo--milk {
  background:
    radial-gradient(circle at top, rgb(255 255 255 / 0.5), transparent 30%),
    linear-gradient(135deg, #b45309 0%, #d6d3d1 46%, #6f4e37 100%);
}

.product-photo--pastry {
  background:
    radial-gradient(circle at top, rgb(255 251 235 / 0.45), transparent 30%),
    linear-gradient(135deg, #f59e0b 0%, #c2410c 45%, #7c2d12 100%);
}

.product-photo__glow {
  position: absolute;
  inset: auto auto 8px 8px;
  width: 54px;
  height: 54px;
  border-radius: 999px;
  background: rgb(255 255 255 / 0.14);
  filter: blur(2px);
}

.product-photo__label {
  position: absolute;
  left: 8px;
  top: 8px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgb(255 255 255 / 0.84);
}

.product-photo :deep(svg) {
  width: 38px;
  height: 38px;
}
</style>
