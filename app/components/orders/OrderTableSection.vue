<template>
  <section class="space-y-5 rounded-md bg-white p-2 shadow-sm ring-1 ring-slate-200">
    <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <h2 class="text-xl font-semibold text-slate-900">{{ $t("Orders") }}</h2>
        <p class="text-sm text-slate-500">{{ total }} {{ $t("matching orders across the current filters.") }}</p>
      </div>
    </div>
    <div class="min-w-0 overflow-x-auto">
      <el-table
        :data="items"
        v-loading="loading"
        stripe
        width="100%"
        :empty-text="searchKeyword ? $t('No orders match your search.') : $t('No orders found yet.')"
      >
        <el-table-column :label="$t('Order')" min-width="220">
          <template #default="{ row }">
            <div>
              <p class="font-semibold text-slate-900">{{ row.orderNumber }}</p>
              <p class="text-xs text-slate-500">{{ formatDate(row.createdOn) }}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('Customer')" min-width="180">
          <template #default="{ row }">
            <div>
              <p class="font-medium text-slate-900">{{ row.customer?.name || $t("Walk-in guest") }}</p>
              <p class="text-xs text-slate-500">{{ row.customer?.phone || row.customer?.email || $t("No contact details") }}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('Type')" min-width="140">
          <template #default="{ row }">
            <div>
              <p class="font-medium text-slate-900">{{ formatLabel(row.type) }}</p>
              <p class="text-xs text-slate-500">{{ row.orderItems.length }} {{ $t("items") }}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('Amount')" min-width="120">
          <template #default="{ row }">
            <div>
              <p class="font-semibold text-slate-900">${{ Number(row.finalAmount).toFixed(2) }}</p>
              <p class="text-xs text-slate-500">{{ formatLabel(row.paymentMethod) }}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('Status')" min-width="140">
          <template #default="{ row }">
            <el-tag :type="statusTag(row.status)" effect="light" round>{{ formatLabel(row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column :label="$t('Payment')" min-width="140">
          <template #default="{ row }">
            <el-tag :type="paymentTag(row.paymentStatus)" effect="light" round>{{ formatLabel(row.paymentStatus) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column :label="$t('Action')" min-width="120" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" link @click="$emit('view', row)">
              <el-icon class="mr-1"><View /></el-icon>
              {{ $t("Manage") }}
            </el-button>
          </template>
        </el-table-column>
        <template #empty>
          <div class="flex flex-col items-center gap-3 py-10 text-center">
            <div class="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-500">
              <el-icon :size="24"><Box /></el-icon>
            </div>
            <div>
              <p class="text-base font-semibold text-slate-900">{{ $t("No matching orders") }}</p>
              <p class="mt-1 max-w-sm text-sm text-slate-500">
                {{ $t("Adjust the search term or filters to widen the result set.") }}
              </p>
            </div>
          </div>
        </template>
      </el-table>
    </div>

    <div class="flex justify-end" v-if="total">
      <el-pagination
        background
        layout="total, sizes, prev, pager, next"
        :total="total"
        :current-page="currentPage"
        :page-size="pageSize"
        :page-sizes="[10, 20, 50]"
        @update:current-page="$emit('update:currentPage', $event)"
        @update:page-size="$emit('update:pageSize', $event)"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import { Box, View } from "@element-plus/icons-vue";
import type { OrderStatus, PaymentStatus } from "~~/prisma/generated/enums";
import type { OrderSummary } from "~/model/order";
const { t } = useI18n();

const props = defineProps<{
  items: OrderSummary[];
  total: number;
  loading: boolean;
  currentPage: number;
  pageSize: number;
  searchKeyword: string;
  statusFilter: OrderStatus | "ALL";
  paymentStatusFilter: PaymentStatus | "ALL";
}>();

defineEmits<{
  (event: "update:currentPage", value: number): void;
  (event: "update:pageSize", value: number): void;
  (event: "update:searchKeyword", value: string): void;
  (event: "update:statusFilter", value: OrderStatus | "ALL"): void;
  (event: "update:paymentStatusFilter", value: PaymentStatus | "ALL"): void;
  (event: "reset-filters"): void;
  (event: "view", value: OrderSummary): void;
}>();

const statusTag = (status: OrderStatus) => {
  if (status === "COMPLETED") return "success";
  if (status === "READY" || status === "CONFIRMED") return "primary";
  if (status === "PREPARING") return "warning";
  if (status === "CANCELLED") return "danger";
  return "info";
};

const paymentTag = (status: PaymentStatus) => {
  if (status === "PAID") return "success";
  if (status === "PARTIALLY_PAID") return "warning";
  if (status === "REFUNDED") return "danger";
  return "info";
};

const formatLabel = (value: string) =>
  t(
    {
      ALL: "All",
      PENDING: "Pending",
      CONFIRMED: "Confirmed",
      PREPARING: "Preparing",
      READY: "Ready",
      COMPLETED: "Completed",
      CANCELLED: "Cancelled",
      UNPAID: "Unpaid",
      PAID: "Paid",
      PARTIALLY_PAID: "Partially paid",
      REFUNDED: "Refunded",
      TAKEAWAY: "Takeaway",
      DELIVERY: "Delivery",
      IN_STORE: "In store",
      CASH: "Cash",
      CARD: "Card",
      MOBILE_MONEY: "Mobile money",
      QR_CODE: "QR code",
      OTHER: "Other",
    }[value] ?? value,
  );

const formatDate = (value: string) =>
  new Date(value).toLocaleString([], {
    dateStyle: "medium",
    timeStyle: "short",
  });
</script>

<style scoped>
.order-filter-group {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.order-filter-group :deep(.el-radio-button__inner) {
  border-radius: 9999px;
  border: 1px solid rgb(203 213 225);
  box-shadow: none;
  padding: 0.55rem 0.95rem;
}

.order-filter-group :deep(.el-radio-button:first-child .el-radio-button__inner),
.order-filter-group :deep(.el-radio-button:last-child .el-radio-button__inner) {
  border-radius: 9999px;
}

.order-filter-group :deep(.el-radio-button__original-radio:checked + .el-radio-button__inner) {
  border-color: rgb(37 99 235);
  background: rgb(37 99 235);
  box-shadow: none;
}
</style>
