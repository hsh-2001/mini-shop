<template>
  <el-dialog
    :model-value="open"
    top="20px"
    :width="isMobile ? '95%' : '600px'"
    destroy-on-close
    append-to-body
    @update:model-value="emit('update:open', $event)"
  >
    <template #header>
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-lg font-semibold">{{ $t("Update Order") }}</h2>
          <p class="text-xs text-slate-500">
            {{ order?.orderNumber }}
          </p>
        </div>

        <el-tag :type="statusTagType(order?.status)">
          {{ order?.status ? formatLabel(order?.status) : "" }}
        </el-tag>
      </div>
    </template>

    <div
      v-if="order"
      class="w-full max-h-[70dvh] space-y-5 overflow-y-auto pr-1"
    >
      <section class="grid gap-3 md:grid-cols-2">
        <div class="bg-slate-50 p-2 rounded-md">
          <p class="text-xs text-slate-500">{{ $t("Customer") }}</p>
          <p class="font-medium">
            {{ order.customer?.name || $t("Walk-in guest") }}
          </p>
          <p class="text-sm text-slate-500">
            {{ order.customer?.phone || "-" }}
          </p>
        </div>

        <div class="bg-slate-50 p-2 rounded-md">
          <p class="text-xs text-slate-500">{{ $t("Created") }}</p>
          <p class="font-medium">
            {{ new Date(order.createdOn).toLocaleString() }}
          </p>
        </div>
      </section>

      <section>
        <h4 class="text-sm font-semibold mb-2">{{ $t("Items") }}</h4>

        <div class="space-y-2">
          <div
            v-for="item in order.orderItems"
            :key="item.id"
            class="flex flex-col gap-3 rounded-md border border-primary/40 p-2 md:flex-row md:justify-between"
          >
            <div>
              <p class="font-medium text-sm">
                {{ item.product?.name || $t("Unknown") }}
              </p>
              <p class="text-sm font-medium text-slate-500">
                {{ item.quantity }} × {{ formatMoney(Number(item.unitPrice)) }}
              </p>
            </div>

            <div class="grid items-end gap-1 text-sm md:place-items-end">
              <span class="font-medium">{{ formatMoney(Number(item.subtotal)) }}</span>
              <div class="grid gap-1">
                <div
                  v-for="(modifiers, index) in item.selectedModifiers"
                  :key="index"
                  class="flex flex-wrap gap-1 rounded-md bg-gray-50 p-1 md:justify-end"
                >
                  <div
                    v-for="(modifier, key, modIndex) in modifiers"
                    :key="`${String(key)}-${modIndex}`"
                  >
                    <p class="text-xs text-slate-500">
                      {{ $t(String(key)) }}:
                      {{ typeof modifier === "string" ? $t(modifier) : modifier }}
                      {{ ['ice', 'sugar'].includes(String(key)) ? '%' : '' }}
                      <span v-if="modIndex !== Object.keys(modifiers).length - 1">,</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <el-form
        label-position="top"
        class="w-full grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <el-form-item :label="$t('Order Status')" class="w-full">
          <el-select v-model="formModel.status" class="w-full">
            <el-option :label="$t('Pending')" value="PENDING" />
            <el-option :label="$t('Preparing')" value="PREPARING" />
            <el-option :label="$t('Ready')" value="READY" />
            <el-option :label="$t('Completed')" value="COMPLETED" />
            <el-option :label="$t('Cancelled')" value="CANCELLED" />
          </el-select>
        </el-form-item>

        <el-form-item :label="$t('Payment Status')" class="w-full">
          <el-select v-model="formModel.paymentStatus" class="w-full">
            <el-option :label="$t('Unpaid')" value="UNPAID" />
            <el-option :label="$t('Paid')" value="PAID" />
            <el-option :label="$t('Partially paid')" value="PARTIALLY_PAID" />
            <el-option :label="$t('Refunded')" value="REFUNDED" />
          </el-select>
        </el-form-item>
      </el-form>

      <el-input
        type="textarea"
        :rows="3"
        :placeholder="$t('Internal notes...')"
        v-model="formModel.notes"
      />

      <div class="bg-slate-900/5 text-slate-900 p-4 rounded-md">
        <div class="flex justify-between text-sm opacity-80">
          <span>{{ $t("Payment method") }}</span>
          <span>{{ formatLabel(order.paymentMethod) }}</span>
        </div>

        <div class="flex justify-between mt-2 text-lg font-semibold">
          <span>{{ $t("Total") }}</span>
          <span>{{ formatMoney(Number(order.finalAmount)) }}</span>
        </div>
        <div class="mt-1 flex justify-between text-xs opacity-70">
          <span>{{ $t("Converted") }}</span>
          <span>{{ formatAlternateMoney(Number(order.finalAmount)) }}</span>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="flex justify-end w-full">
        <el-button @click="$emit('update:open', false)">{{
          $t("Close")
        }}</el-button>

        <el-button type="primary" :loading="saving" @click="$emit('save')">
          {{ $t("Save Changes") }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import type { OrderStatus, PaymentStatus } from "~~/prisma/generated/enums";
import type { IOrderSummary } from "~/model/order";
import { formatCurrency } from "~/utils/currencyFormat";
const { t } = useI18n();


const props = defineProps<{
  open: boolean;
  saving: boolean;
  order: IOrderSummary | null;
  form: {
    status: OrderStatus;
    paymentStatus: PaymentStatus;
    notes: string;
  };
}>();

const emit = defineEmits<{
  (event: "update:open", value: boolean): void;
  (
    event: "update:form",
    value: {
      status: OrderStatus;
      paymentStatus: PaymentStatus;
      notes: string;
    },
  ): void;
  (event: "save"): void;
}>();

const { isMobile } = deviceHelper();

const formModel = computed({
  get: () => props.form,
  set: (val) => emit("update:form", val),
});

const store = useAppStore();
const primaryCurrency = computed(() => store.currentCurrency.currencyBase || "USD");
const secondaryCurrency = computed(() =>
  primaryCurrency.value === "USD" ? "KHR" : "USD",
);

const formatMoney = (amount: number) => formatCurrency(amount, primaryCurrency.value);
const formatAlternateMoney = (amount: number) =>
  formatCurrency(amount, secondaryCurrency.value);

const formatLabel = (value: string) =>
  t(
    {
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

const statusTagType = (status?: string) => {
  switch (status) {
    case "COMPLETED":
      return "success";
    case "CANCELLED":
      return "danger";
    case "PENDING":
      return "warning";
    case "PREPARING":
      return "info";
    case "READY":
      return "primary";
    default:
      return "info";
  }
};
</script>
