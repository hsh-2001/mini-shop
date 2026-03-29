<template>
  <el-card shadow="never" class="cashier-header border-0">
    <div class="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
      <div class="space-y-3">
        <el-tag type="success" effect="plain" round size="small">Cashier</el-tag>
        <div>
          <h1 class="text-2xl font-semibold tracking-tight text-slate-900">
            {{ shopLabel }}
          </h1>
          <p class="mt-1 max-w-2xl text-sm text-slate-600">
            Fast checkout with compact controls for counter orders.
          </p>
        </div>

        <div class="flex flex-wrap gap-2">
          <el-tag round effect="dark">{{ cartCount }} items</el-tag>
          <el-tag round type="info">{{ cartLineCount }} lines</el-tag>
          <el-tag round type="success">{{ productCount }} visible</el-tag>
          <el-tag round type="warning">{{ activeCategoryLabel }}</el-tag>
        </div>
      </div>

      <div class="grid gap-2 sm:grid-cols-3">
        <div class="step-chip">
          <span class="step-chip__label">Find</span>
          <span class="step-chip__text">Search or filter</span>
        </div>
        <div class="step-chip">
          <span class="step-chip__label">Build</span>
          <span class="step-chip__text">Add and adjust</span>
        </div>
        <div class="step-chip step-chip--accent">
          <span class="step-chip__label">Charge</span>
          <span class="step-chip__text">Confirm and save</span>
        </div>
      </div>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { CategoryItem } from "~/model/inventory";

const props = defineProps<{
  shopLabel: string;
  cartCount: number;
  cartLineCount: number;
  productCount: number;
  selectedCategoryId: number | "all";
  categories: CategoryItem[];
}>();

const activeCategoryLabel = computed(() => {
  if (props.selectedCategoryId === "all") {
    return "All categories";
  }

  return props.categories.find((category) => category.id === props.selectedCategoryId)?.name ?? "Selected category";
});
</script>

<style scoped>
.cashier-header :deep(.el-card__body) {
  padding: 18px 20px;
  background:
    radial-gradient(circle at top left, rgb(220 252 231 / 0.9), transparent 32%),
    linear-gradient(135deg, #ffffff 0%, #f8fafc 55%, #fff7ed 100%);
}

.step-chip {
  display: flex;
  min-width: 120px;
  flex-direction: column;
  gap: 2px;
  border: 1px solid rgb(226 232 240);
  border-radius: 16px;
  padding: 10px 12px;
  background: rgb(255 255 255 / 0.78);
}

.step-chip--accent {
  border-color: rgb(16 185 129 / 0.25);
  background: rgb(236 253 245 / 0.85);
}

.step-chip__label {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: rgb(100 116 139);
}

.step-chip__text {
  font-size: 13px;
  font-weight: 600;
  color: rgb(15 23 42);
}
</style>
