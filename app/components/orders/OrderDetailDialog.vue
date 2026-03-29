<template>
  <el-dialog
    :model-value="open"
    width="760px"
    class="!rounded-2xl"
    @update:model-value="$emit('update:open', $event)"
  >
    <!-- HEADER -->
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

    <!-- BODY -->
    <div v-if="order" class="space-y-5 max-h-[70vh] overflow-y-auto pr-1">
      <!-- INFO -->
      <section class="grid gap-3 md:grid-cols-2">
        <div class="bg-slate-50 p-3 rounded-xl">
          <p class="text-xs text-slate-500">{{ $t("Customer") }}</p>
          <p class="font-medium">
            {{ order.customer?.name || $t("Walk-in guest") }}
          </p>
          <p class="text-sm text-slate-500">
            {{ order.customer?.phone || "-" }}
          </p>
        </div>

        <div class="bg-slate-50 p-3 rounded-xl">
          <p class="text-xs text-slate-500">{{ $t("Created") }}</p>
          <p class="font-medium">
            {{ new Date(order.createdOn).toLocaleString() }}
          </p>
        </div>
      </section>

      <!-- ITEMS -->
      <section>
        <h4 class="text-sm font-semibold mb-2">{{ $t("Items") }}</h4>

        <div class="space-y-2">
          <div
            v-for="item in order.orderItems"
            :key="item.id"
            class="flex justify-between items-center border rounded-xl px-3 py-2"
          >
            <div>
              <p class="font-medium text-sm">
                {{ item.product?.name || $t("Unknown") }}
              </p>
              <p class="text-xs text-slate-500">
                {{ item.quantity }} × ${{ Number(item.unitPrice).toFixed(2) }}
              </p>
            </div>

            <p class="font-semibold text-sm">
              ${{ Number(item.subtotal).toFixed(2) }}
            </p>
          </div>
        </div>
      </section>

      <!-- CONTROLS -->
      <section class="grid md:grid-cols-2 gap-3">
        <el-form label-position="top" class="w-full">
          <el-form-item :label="$t('Order Status')">
            <el-select
              :model-value="form.status"
              @update:model-value="(val) => updateForm('status', val)"
            >
              <el-option :label="$t('Pending')" value="PENDING" />
              <el-option :label="$t('Preparing')" value="PREPARING" />
              <el-option :label="$t('Ready')" value="READY" />
              <el-option :label="$t('Completed')" value="COMPLETED" />
              <el-option :label="$t('Cancelled')" value="CANCELLED" />
            </el-select>
          </el-form-item>

          <el-form-item :label="$t('Payment Status')">
            <el-select
              :model-value="form.paymentStatus"
              @update:model-value="(val) => updateForm('paymentStatus', val)"
            >
              <el-option :label="$t('Unpaid')" value="UNPAID" />
              <el-option :label="$t('Paid')" value="PAID" />
              <el-option :label="$t('Partially paid')" value="PARTIALLY_PAID" />
              <el-option :label="$t('Refunded')" value="REFUNDED" />
            </el-select>
          </el-form-item>
        </el-form>
      </section>

      <!-- NOTES -->
      <el-input
        type="textarea"
        :rows="3"
        :placeholder="$t('Internal notes...')"
        :model-value="form.notes"
        @update:model-value="(val) => updateForm('notes', val)"
      />

      <!-- SUMMARY -->
      <div class="bg-slate-900 text-white p-4 rounded-xl">
        <div class="flex justify-between text-sm opacity-80">
          <span>{{ $t("Payment method") }}</span>
          <span>{{ formatLabel(order.paymentMethod) }}</span>
        </div>

        <div class="flex justify-between mt-2 text-lg font-semibold">
          <span>{{ $t("Total") }}</span>
          <span> ${{ Number(order.finalAmount).toFixed(2) }} </span>
        </div>
      </div>
    </div>

    <!-- FOOTER -->
    <template #footer>
      <div class="flex justify-between w-full">
        <el-button @click="$emit('update:open', false)">{{ $t("Close") }}</el-button>

        <el-button type="primary" :loading="saving" @click="confirmSave">
          {{ $t("Save Changes") }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ElMessageBox, ElMessage } from "element-plus";
import type { OrderStatus, PaymentStatus } from "~~/prisma/generated/enums";
import type { OrderSummary } from "~/model/order";
const { t } = useI18n();

const props = defineProps<{
  open: boolean;
  saving: boolean;
  order: OrderSummary | null;
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

// ✅ update form helper
const updateForm = (key: string, value: any) => {
  emit("update:form", {
    ...props.form,
    [key]: key === "notes" ? String(value ?? "") : value,
  });
};

// ✅ confirm before save
const confirmSave = async () => {
  try {
    await ElMessageBox.confirm(
      t("Are you sure you want to update this order?"),
      t("Confirm Update"),
      {
        type: "warning",
        confirmButtonText: t("Yes, save"),
        cancelButtonText: t("Cancel"),
      },
    );

    emit("save");
    ElMessage.success(t("Order updated successfully"));
  } catch {
    // user cancelled
  }
};

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
