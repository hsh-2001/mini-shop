<template>
  <section class="space-y-4 rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-slate-200">
    <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <h2 class="text-xl font-semibold text-slate-900">Orders</h2>
        <p class="text-sm text-slate-500">Track order and payment progression.</p>
      </div>

      <div class="flex flex-col gap-3 sm:flex-row">
        <el-select
          :model-value="statusFilter"
          class="w-full sm:w-48"
          @update:model-value="$emit('update:statusFilter', $event)"
        >
          <el-option label="All statuses" value="ALL" />
          <el-option label="Pending" value="PENDING" />
          <el-option label="Confirmed" value="CONFIRMED" />
          <el-option label="Preparing" value="PREPARING" />
          <el-option label="Ready" value="READY" />
          <el-option label="Completed" value="COMPLETED" />
          <el-option label="Cancelled" value="CANCELLED" />
        </el-select>

        <el-select
          :model-value="paymentStatusFilter"
          class="w-full sm:w-48"
          @update:model-value="$emit('update:paymentStatusFilter', $event)"
        >
          <el-option label="All payments" value="ALL" />
          <el-option label="Unpaid" value="UNPAID" />
          <el-option label="Paid" value="PAID" />
          <el-option label="Partially paid" value="PARTIALLY_PAID" />
          <el-option label="Refunded" value="REFUNDED" />
        </el-select>
      </div>
    </div>

    <el-table :data="items" v-loading="loading" border>
      <el-table-column prop="orderNumber" label="Order #" min-width="180" />
      <el-table-column label="Customer" min-width="180">
        <template #default="{ row }">
          <div>
            <p class="font-medium text-slate-900">{{ row.customer?.name || "Walk-in guest" }}</p>
            <p class="text-xs text-slate-500">{{ row.customer?.phone || "No phone" }}</p>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="type" label="Type" min-width="120" />
      <el-table-column label="Amount" min-width="120">
        <template #default="{ row }">${{ Number(row.finalAmount).toFixed(2) }}</template>
      </el-table-column>
      <el-table-column label="Status" min-width="140">
        <template #default="{ row }">
          <el-tag :type="statusTag(row.status)" effect="light">{{ row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Payment" min-width="140">
        <template #default="{ row }">
          <el-tag :type="paymentTag(row.paymentStatus)" effect="light">{{ row.paymentStatus }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Created" min-width="180">
        <template #default="{ row }">
          {{ new Date(row.createdOn).toLocaleString() }}
        </template>
      </el-table-column>
      <el-table-column label="Action" min-width="120" fixed="right">
        <template #default="{ row }">
          <el-button type="primary" link @click="$emit('view', row)">Manage</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="flex justify-end">
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
import type { OrderStatus, PaymentStatus } from "~~/prisma/generated/enums";
import type { OrderSummary } from "~/model/order";

defineProps<{
  items: OrderSummary[];
  total: number;
  loading: boolean;
  currentPage: number;
  pageSize: number;
  statusFilter: OrderStatus | "ALL";
  paymentStatusFilter: PaymentStatus | "ALL";
}>();

defineEmits<{
  (event: "update:currentPage", value: number): void;
  (event: "update:pageSize", value: number): void;
  (event: "update:statusFilter", value: OrderStatus | "ALL"): void;
  (event: "update:paymentStatusFilter", value: PaymentStatus | "ALL"): void;
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
</script>
