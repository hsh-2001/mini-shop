<template>
  <el-dialog
    :model-value="open"
    width="720px"
    title="Update Order"
    @update:model-value="$emit('update:open', $event)"
  >
    <div v-if="order" class="space-y-6">
      <section class="grid gap-4 md:grid-cols-2">
        <div class="rounded-2xl bg-slate-50 p-4">
          <p class="text-xs uppercase tracking-[0.2em] text-slate-500">Order</p>
          <h3 class="mt-2 text-lg font-semibold text-slate-900">{{ order.orderNumber }}</h3>
          <p class="mt-1 text-sm text-slate-500">{{ new Date(order.createdOn).toLocaleString() }}</p>
        </div>
        <div class="rounded-2xl bg-slate-50 p-4">
          <p class="text-xs uppercase tracking-[0.2em] text-slate-500">Customer</p>
          <h3 class="mt-2 text-lg font-semibold text-slate-900">{{ order.customer?.name || "Walk-in guest" }}</h3>
          <p class="mt-1 text-sm text-slate-500">{{ order.customer?.phone || "No phone provided" }}</p>
        </div>
      </section>

      <section class="space-y-3">
        <h4 class="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Items</h4>
        <div
          v-for="item in order.orderItems"
          :key="item.id"
          class="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3"
        >
          <div>
            <p class="font-medium text-slate-900">{{ item.product?.name || "Unknown product" }}</p>
            <p class="text-sm text-slate-500">Qty {{ item.quantity }} x ${{ Number(item.unitPrice).toFixed(2) }}</p>
          </div>
          <p class="font-semibold text-slate-900">${{ Number(item.subtotal).toFixed(2) }}</p>
        </div>
      </section>

      <section class="grid gap-4 md:grid-cols-2">
        <el-select
          :model-value="form.status"
          placeholder="Order status"
          @update:model-value="$emit('update:form', { ...form, status: $event })"
        >
          <el-option label="Pending" value="PENDING" />
          <el-option label="Confirmed" value="CONFIRMED" />
          <el-option label="Preparing" value="PREPARING" />
          <el-option label="Ready" value="READY" />
          <el-option label="Completed" value="COMPLETED" />
          <el-option label="Cancelled" value="CANCELLED" />
        </el-select>

        <el-select
          :model-value="form.paymentStatus"
          placeholder="Payment status"
          @update:model-value="$emit('update:form', { ...form, paymentStatus: $event })"
        >
          <el-option label="Unpaid" value="UNPAID" />
          <el-option label="Paid" value="PAID" />
          <el-option label="Partially paid" value="PARTIALLY_PAID" />
          <el-option label="Refunded" value="REFUNDED" />
        </el-select>
      </section>

      <el-input
        type="textarea"
        :rows="4"
        :model-value="form.notes"
        placeholder="Internal notes"
        @update:model-value="$emit('update:form', { ...form, notes: String($event ?? '') })"
      />

      <div class="rounded-2xl bg-slate-950 p-4 text-slate-50">
        <div class="flex items-center justify-between">
          <span class="text-sm text-slate-300">Payment method</span>
          <span class="font-medium">{{ order.paymentMethod }}</span>
        </div>
        <div class="mt-3 flex items-center justify-between">
          <span class="text-sm text-slate-300">Final amount</span>
          <span class="text-xl font-semibold">${{ Number(order.finalAmount).toFixed(2) }}</span>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="flex justify-end gap-3">
        <el-button @click="$emit('update:open', false)">Close</el-button>
        <el-button type="primary" :loading="saving" @click="$emit('save')">Save changes</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import type { OrderStatus, PaymentStatus } from "~~/prisma/generated/enums";
import type { OrderSummary } from "~/model/order";

defineProps<{
  open: boolean;
  saving: boolean;
  order: OrderSummary | null;
  form: {
    status: OrderStatus;
    paymentStatus: PaymentStatus;
    notes: string;
  };
}>();

defineEmits<{
  (event: "update:open", value: boolean): void;
  (event: "update:form", value: {
    status: OrderStatus;
    paymentStatus: PaymentStatus;
    notes: string;
  }): void;
  (event: "save"): void;
}>();
</script>
