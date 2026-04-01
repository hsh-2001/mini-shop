<template>
  <el-card class="w-full" shadow="never">
    <template #header>
      <div class="flex justify-between">
        <div class="w-full">
          <h3 class="text-xl font-bold">{{ $t("Orders") }}</h3>
        </div>
        <div class="w-full flex justify-end gap-2">
          <el-button
            type="primary"
            :loading="isDownloading"
            @click="$emit('export')"
          >
            <Sheet class="mr-1 h-4 w-4" />
            <span>{{ $t("Export") }}</span>
          </el-button>
        </div>
      </div>
      <ClientOnly>
        <div v-if="filterForm" class="w-full bg-primary/10 p-2 mt-2 rounded-md">
          <el-form :model="form" class="w-full flex gap-2">
            <el-form-item :label="$t('Filter date')" class="w-64 mb-0!">
              <el-date-picker
                v-model="form.date"
                type="date"
                :placeholder="$t('Select date')"
                :format="'YYYY-MM-DD'"
                :value-format="'YYYY-MM-DD'"
                class="w-50!"
                :disabled-date="
                  (date: Date) => {
                    const today = new Date();
                    return date > today;
                  }
                "
              />
            </el-form-item>
            <el-form-item :label="$t('Status')" class="w-50 mb-0!">
              <el-select
                v-model="form.status"
                multiple
                collapse-tags
                clearable
                :placeholder="$t('Select status')"
              >
                <el-option :label="$t('Pending')" value="PENDING" />
                <el-option :label="$t('Confirmed')" value="CONFIRMED" />
                <el-option :label="$t('Preparing')" value="PREPARING" />
                <el-option :label="$t('Ready')" value="READY" />
                <el-option :label="$t('Completed')" value="COMPLETED" />
                <el-option :label="$t('Cancelled')" value="CANCELLED" />
              </el-select>
            </el-form-item>
            <el-button
              type="primary"
              @click="$emit('search')"
              class="self-end mb-0!"
            >
              {{ $t("Search") }}
            </el-button>
          </el-form>
        </div>
      </ClientOnly>
    </template>
    <div class="min-w-0 overflow-x-auto">
      <el-table :data="items" v-loading="loading" width="100%" height="70dvh">
        <el-table-column
          :label="$t('Order')"
          min-width="220"
          prop="formattedCreatedOn"
        />
        <el-table-column :label="$t('Customer')" min-width="180">
          <template #default="{ row }">
            <div>
              <p class="font-medium text-slate-900">
                {{ row.customer?.name || $t("Walk-in guest") }}
              </p>
              <p class="text-xs text-slate-500">
                {{
                  row.customer?.phone ||
                  row.customer?.email ||
                  $t("No contact details")
                }}
              </p>
            </div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('Type')" min-width="140">
          <template #default="{ row }">
            <div>
              <p class="font-medium text-slate-900">
                {{ formatLabel(row.type) }}
              </p>
              <p class="text-xs text-slate-500">
                {{ row.orderItems.length }} {{ $t("items") }}
              </p>
            </div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('Amount')" min-width="120">
          <template #default="{ row }">
            <div>
              <p class="font-semibold text-slate-900">
                {{ formatMoney(Number(row.finalAmount)) }}
              </p>
              <p class="text-xs text-slate-500">
                {{ formatAlternateMoney(Number(row.finalAmount)) }} ·
                {{ formatLabel(row.paymentMethod) }}
              </p>
            </div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('Status')" min-width="140">
          <template #default="{ row }">
            <el-tag :type="statusTag(row.status)" effect="light" round>{{
              formatLabel(row.status)
            }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column :label="$t('Payment')" min-width="140">
          <template #default="{ row }">
            <el-tag
              :type="paymentTag(row.paymentStatus)"
              effect="light"
              round
              >{{ formatLabel(row.paymentStatus) }}</el-tag
            >
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
            <div
              class="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-500"
            >
              <el-icon :size="24"><Box /></el-icon>
            </div>
            <div>
              <p class="text-base font-semibold text-slate-900">
                {{ $t("No matching orders") }}
              </p>
              <p class="mt-1 max-w-sm text-sm text-slate-500">
                {{
                  $t(
                    "Adjust the search term or filters to widen the result set.",
                  )
                }}
              </p>
            </div>
          </div>
        </template>
      </el-table>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { Box, View } from "@element-plus/icons-vue";
import type { OrderStatus, PaymentStatus } from "~~/prisma/generated/enums";
import type { GetOrderSummaryListResponse } from "~/model/order";
import { formatCurrency } from "~/utils/currencyFormat";
import { Sheet } from "@lucide/vue";
const { t } = useI18n();

const props = defineProps<{
  items: GetOrderSummaryListResponse[];
  loading: boolean;
  currentPage: number;
  pageSize: number;
  isDownloading: boolean;
  filterForm: {
    date: string | Date;
    status: OrderStatus[];
  };
}>();

const emit = defineEmits<{
  (event: "update:currentPage", value: number): void;
  (event: "update:pageSize", value: number): void;
  (event: "view", value: GetOrderSummaryListResponse): void;
  (event: "export"): void;
  (event: "update:filterForm", value: { date: string | Date }): void;
  (event: "search"): void;
}>();

const form = computed({
  get: () => props.filterForm,
  set: (value) => emit("update:filterForm", value ?? { date: null }),
});

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

const store = useAppStore();
const primaryCurrency = computed(
  () => store.currentCurrency.currencyBase || "USD",
);
const secondaryCurrency = computed(() =>
  primaryCurrency.value === "USD" ? "KHR" : "USD",
);

const formatMoney = (amount: number) =>
  formatCurrency(amount, primaryCurrency.value);
const formatAlternateMoney = (amount: number) =>
  formatCurrency(amount, secondaryCurrency.value);

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

const value2 = ref("");

const shortcuts = [
  {
    text: "Last week",
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setDate(start.getDate() - 7);
      return [start, end];
    },
  },
  {
    text: "Last month",
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setMonth(start.getMonth() - 1);
      return [start, end];
    },
  },
  {
    text: "Last 3 months",
    value: () => {
      const end = new Date();
      const start = new Date();
      start.setMonth(start.getMonth() - 3);
      return [start, end];
    },
  },
];
</script>

<style scoped></style>
