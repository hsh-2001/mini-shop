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
          <el-form :model="form" class="w-full flex flex-wrap gap-2 items-end">
            <el-form-item :label="$t('Date Filter')" class="mb-0!">
              <el-radio-group v-model="form.dateFilterMode" size="default">
                <el-radio-button value="ALL">{{ $t('All Time') }}</el-radio-button>
                <el-radio-button value="PERIOD">{{ $t('Custom Period') }}</el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-form-item v-if="form.dateFilterMode === 'PERIOD'" class="w-80 mb-0!">
              <el-date-picker
                v-model="dateRange"
                type="daterange"
                range-separator="—"
                :start-placeholder="$t('Start date')"
                :end-placeholder="$t('End date')"
                :format="'YYYY-MM-DD'"
                :value-format="'YYYY-MM-DD'"
                class="w-full!"
                :disabled-date="
                  (date: Date) => {
                    const today = new Date();
                    return date > today;
                  }
                "
              />
            </el-form-item>
            <el-form-item :label="$t('Status')" class="w-50 mb-0!">
              <el-select v-model="form.status" multiple collapse-tags clearable>
                <el-option
                  v-for="option in orderStatusOptions"
                  :key="option.value"
                  :label="$t(option.label)"
                  :value="option.value"
                />
              </el-select>
            </el-form-item>
            <el-button
              type="primary"
              @click="$emit('search')"
              class="mb-0!"
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
                {{
                  $t(
                    customerTypeOptions.find((o) => o.value === row.type)
                      ?.label || row.type,
                  )
                }}
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
                {{
                  $t(
                    paymentStatusOptions.find(
                      (o) => o.value === row.paymentMethod,
                    )?.label || row.paymentMethod,
                  )
                }}
              </p>
            </div>
          </template>
        </el-table-column>
        <el-table-column :label="$t('Status')" min-width="140">
          <template #default="{ row }">
            <el-tag :type="statusTag(row.status)" effect="light" round>{{
              $t(
                orderStatusOptions.find((o) => o.value === row.status)?.label ||
                  row.status,
              )
            }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column :label="$t('Payment')" min-width="140">
          <template #default="{ row }">
            <el-tag
              :type="paymentTag(row.paymentStatus)"
              effect="light"
              round
              >{{
                $t(
                  paymentStatusOptions.find(
                    (o) => o.value === row.paymentStatus,
                  )?.label || row.paymentStatus,
                )
              }}</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('Action')"
          min-width="80"
          align="center"
          fixed="right"
        >
          <template #default="{ row }">
            <el-button type="primary" link @click="$emit('view', row)">
              <el-icon><View /></el-icon>
            </el-button>
          </template>
        </el-table-column>
        <template #empty>
          <div class="flex flex-col items-center gap-3 py-10 text-center">
            <div
              class="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-500"
            >
              <Eyes class="h-6 w-6" />
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
import { Eye, Sheet } from "@lucide/vue";
import {
  customerTypeOptions,
  orderStatusOptions,
  paymentStatusOptions,
} from "~/constants/common";
const { t } = useI18n();

const props = defineProps<{
  items: GetOrderSummaryListResponse[];
  loading: boolean;
  currentPage: number;
  pageSize: number;
  isDownloading: boolean;
  filterForm: {
    dateFilterMode: 'ALL' | 'PERIOD';
    dateFrom: string;
    dateTo: string;
    status: OrderStatus[];
  };
}>();

const emit = defineEmits<{
  (event: "update:currentPage", value: number): void;
  (event: "update:pageSize", value: number): void;
  (event: "view", value: GetOrderSummaryListResponse): void;
  (event: "export"): void;
  (event: "update:filterForm", value: { dateFilterMode: 'ALL' | 'PERIOD'; dateFrom: string; dateTo: string }): void;
  (event: "search"): void;
}>();

const form = computed({
  get: () => props.filterForm,
  set: (value) => emit("update:filterForm", value ?? { dateFilterMode: 'ALL', dateFrom: '', dateTo: '' }),
});

const dateRange = ref<[string, string] | null>(
  props.filterForm.dateFrom && props.filterForm.dateTo
    ? [props.filterForm.dateFrom, props.filterForm.dateTo]
    : null,
);

watch(
  () => [props.filterForm.dateFrom, props.filterForm.dateTo],
  ([from, to]) => {
    dateRange.value = from && to ? [from, to] : null;
  },
);

watch(dateRange, (val) => {
  if (val && val.length === 2) {
    emit("update:filterForm", {
      ...props.filterForm,
      dateFrom: val[0],
      dateTo: val[1],
    });
  } else {
    emit("update:filterForm", {
      ...props.filterForm,
      dateFrom: '',
      dateTo: '',
    });
  }
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
</script>

<style scoped></style>
