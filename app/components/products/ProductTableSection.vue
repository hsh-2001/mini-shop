<template>
  <el-card class="rounded-3xl border border-slate-200">
    <template #header>
      <div
        class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between"
      >
        <div>
          <h2 class="text-lg font-semibold text-slate-900">
            {{ $t("Products") }}
          </h2>
          <p class="text-sm text-slate-500">{{ total }} {{ $t("products") }}</p>
        </div>
        <div class="flex flex-col gap-3 md:flex-row md:items-center">
          <el-input
            :model-value="keyword"
            clearable
            :placeholder="$t('Search by product name')"
            class="md:max-w-72"
            @update:model-value="emit('update:keyword', $event)"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
          <el-button
            type="primary"
            :disabled="!canCreate"
            @click="emit('create')"
          >
            <el-icon class="mr-1"><Plus /></el-icon>
            {{ $t("Add Product") }}
          </el-button>
        </div>
      </div>
    </template>

    <el-alert
      v-if="!canCreate"
      :title="$t('Create at least one category before adding products.')"
      type="warning"
      :closable="false"
      class="mb-4"
    />

    <div class="min-w-0 overflow-x-auto">
      <el-table
        v-loading="loading"
        :data="items"
        width="100%"
        height="70dvh"
        border
        :empty-text="$t('No products found.')"
      >
        <el-table-column type="index" :label="$t('#')" width="60" />
        <el-table-column :label="$t('Image')" width="120" align="center">
          <template #default="{ row }">
            <div
              v-if="row.imageUrl"
              class="h-16 w-auto overflow-hidden rounded-md"
            >
              <img
                :src="getImageUrl(row.imageUrl)"
                class="h-full w-full object-cover"
                @error="getFallbackImage"
              />
            </div>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('Name')" min-width="120">
          <template #default="{ row }">
            <div class="font-medium text-slate-900">{{ row.name }}</div>
            <div class="text-xs text-slate-500">
              {{ row.description || $t("No description") }}
            </div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('Category')" min-width="160">
          <template #default="{ row }">
            <el-tag v-if="row.category?.name" type="info" effect="plain">{{
              row.category.name
            }}</el-tag>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column :label="$t('Price')" width="120" sortable>
          <template #default="{ row }">
            {{ formatCurrency(row.basePrice, "KHR") }}
          </template>
        </el-table-column>
        <el-table-column prop="stock" :label="$t('Stock')">
          <template #default="{ row }">
            <span v-if="row.stock === -1" class="text-secondary">
              {{ $t("Unlimited") }}
            </span>
            <span v-else-if="row.stock === 0" class="text-red-500">
              {{ $t("Out of Stock") }}
            </span>
            <span v-else>
              {{ row.stock }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('Actions')"
          width="170"
          align="right"
          fixed="right"
        >
          <template #default="{ row }">
            <el-button type="primary" link @click="emit('edit', row)">
              <el-icon class="mr-1"><Edit /></el-icon>
              {{ $t("Edit") }}
            </el-button>
            <el-button type="danger" link @click="emit('delete', row.id)">
              <el-icon class="mr-1"><Delete /></el-icon>
              {{ $t("Delete") }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <template #footer>
      <div class="flex justify-end" v-if="total">
        <el-pagination
          :current-page="currentPage"
          :page-size="pageSize"
          background
          layout="total, sizes, prev, pager, next"
          :page-sizes="[5, 10, 20, 50]"
          :total="total"
          @update:current-page="emit('update:current-page', $event)"
          @update:page-size="emit('update:page-size', $event)"
        />
      </div>
    </template>
  </el-card>
</template>

<script setup lang="ts">
import { Delete, Edit, Plus, Search } from "@element-plus/icons-vue";
import type { ProductItem } from "~/model/inventory";

defineProps<{
  items: ProductItem[];
  total: number;
  loading: boolean;
  keyword: string;
  currentPage: number;
  pageSize: number;
  canCreate: boolean;
}>();

const emit = defineEmits<{
  "update:keyword": [value: string];
  "update:current-page": [value: number];
  "update:page-size": [value: number];
  create: [];
  edit: [product: ProductItem];
  delete: [id: number];
}>();
</script>
