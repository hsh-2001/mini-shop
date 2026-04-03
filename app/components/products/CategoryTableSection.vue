<template>
  <el-card shadow="never" class="rounded-3xl border border-slate-200">
    <template #header>
      <div class="flex items-center justify-between gap-3">
        <div>
          <h2 class="text-lg font-semibold text-slate-900">
            {{ $t("Categories") }}
          </h2>
          <p class="text-sm text-slate-500">
            {{ total }} {{ $t("categories") }}
          </p>
        </div>
        <el-button type="primary" @click="emit('create')">
          <el-icon class="mr-1"><Plus /></el-icon>
          {{ $t("Add Category") }}
        </el-button>
      </div>
    </template>

    <div class="min-w-0 overflow-x-auto">
      <el-table
        v-loading="loading"
        :data="items"
        border
        stripe
        width="100%"
        :empty-text="$t('No categories found.')"
      >
        <el-table-column type="index" :label="$t('#')" width="60" />
        <el-table-column
          prop="name"
          :label="$t('Name')"
          min-width="180"
          sortable
        />
        <el-table-column :label="$t('Type')" min-width="140">
          <template #default="{ row }">
            <el-tag type="info" effect="plain">
              {{ formatCategoryType(row.type) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column :label="$t('Description')" min-width="220">
          <template #default="{ row }">
            {{ row.description || "-" }}
          </template>
        </el-table-column>
        <el-table-column :label="$t('Actions')" width="80" align="center">
          <template #default="{ row }">
            <el-button type="primary" link @click="emit('edit', row)">
              <el-icon><Edit /></el-icon>
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
import { Edit, Plus } from "@element-plus/icons-vue";
import type { CategoryItem } from "~/model/inventory";

defineProps<{
  items: CategoryItem[];
  total: number;
  loading: boolean;
  currentPage: number;
  pageSize: number;
}>();

const emit = defineEmits<{
  "update:current-page": [value: number];
  "update:page-size": [value: number];
  create: [];
  edit: [category: CategoryItem];
}>();

const formatCategoryType = (value: string) =>
  value
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/^\w/, (char) => char.toUpperCase());
</script>
