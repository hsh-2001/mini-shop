<template>
  <aside class="space-y-5 rounded-[28px] bg-slate-950 p-6 text-slate-50 shadow-sm xl:sticky xl:top-6">
    <div class="flex items-center justify-between">
      <div>
        <p class="text-sm uppercase tracking-[0.22em] text-amber-300">{{ $t("Checkout") }}</p>
        <h2 class="mt-2 text-2xl font-semibold">{{ $t("Cart Summary") }}</h2>
        <p class="mt-2 text-sm text-slate-400">{{ $t("Review items, add customer details, and place the order.") }}</p>
      </div>
      <span class="rounded-full bg-white/10 px-3 py-1 text-sm">{{ cartCount }} {{ $t("items") }}</span>
    </div>

    <div class="space-y-3">
      <div
        v-for="item in cart"
        :key="item.product.id"
        class="rounded-2xl bg-white/6 p-4"
      >
        <div class="flex items-start justify-between gap-4">
          <div>
            <h3 class="font-medium">{{ item.product.name }}</h3>
            <p class="mt-1 text-sm text-slate-300">
              {{ formatMoney(Number(item.product.basePrice)) }} {{ $t("each") }}
            </p>
          </div>
          <el-button text type="danger" @click="$emit('remove', item.product.id)">
            {{ $t("Remove") }}
          </el-button>
        </div>

        <div class="mt-3 flex items-center justify-between gap-4">
          <div class="flex items-center rounded-full border border-white/20 bg-white/5 p-1">
            <button
              type="button"
              class="flex h-8 w-8 items-center justify-center rounded-full text-lg text-white transition hover:bg-white/10"
              @click="$emit('quantity-change', item.product.id, item.quantity - 1)"
            >
              -
            </button>
            <input
              :value="item.quantity"
              type="number"
              min="1"
              :max="item.product.stock >= 0 ? item.product.stock : undefined"
              class="w-14 bg-transparent text-center text-sm font-semibold text-white outline-none"
              @change="$emit('quantity-change', item.product.id, Number(($event.target as HTMLInputElement).value || 1))"
            >
            <button
              type="button"
              class="flex h-8 w-8 items-center justify-center rounded-full text-lg text-white transition hover:bg-white/10"
              @click="$emit('quantity-change', item.product.id, item.quantity + 1)"
            >
              +
            </button>
          </div>
          <p class="text-sm font-semibold">
            {{ formatMoney(Number(item.product.basePrice) * item.quantity) }}
          </p>
        </div>
      </div>

      <div
        v-if="!cart.length"
        class="rounded-2xl border border-dashed border-white/20 px-4 py-8 text-center text-sm text-slate-300"
      >
        <p class="font-medium text-white">{{ $t("Cart is empty.") }}</p>
        <p class="mt-2 text-slate-400">{{ $t("Add products from the menu to begin the order.") }}</p>
      </div>
    </div>

    <div class="rounded-3xl bg-white/6 p-4 ring-1 ring-white/10">
      <div class="mb-4">
        <p class="text-sm font-semibold text-white">{{ $t("Customer details") }}</p>
        <p class="mt-1 text-xs text-slate-400">{{ $t("Only the customer name is required.") }}</p>
      </div>

      <div class="grid gap-4">
        <label class="space-y-2">
          <span class="text-sm text-slate-300">{{ $t("Customer name") }}</span>
          <el-input
            :model-value="form.customerName"
            :placeholder="$t('Enter customer name')"
            @update:model-value="$emit('update:form', { ...form, customerName: String($event ?? '') })"
          />
        </label>
        <label class="space-y-2">
          <span class="text-sm text-slate-300">{{ $t("Phone number") }}</span>
          <el-input
            :model-value="form.customerPhone"
            :placeholder="$t('Optional')"
            @update:model-value="$emit('update:form', { ...form, customerPhone: String($event ?? '') })"
          />
        </label>
        <label class="space-y-2">
          <span class="text-sm text-slate-300">{{ $t("Email address") }}</span>
          <el-input
            :model-value="form.customerEmail"
            :placeholder="$t('Optional')"
            @update:model-value="$emit('update:form', { ...form, customerEmail: String($event ?? '') })"
          />
        </label>
      </div>
    </div>

    <div class="rounded-3xl bg-white/6 p-4 ring-1 ring-white/10">
      <div class="mb-4">
        <p class="text-sm font-semibold text-white">{{ $t("Order preferences") }}</p>
      </div>

      <div class="grid gap-4">
      <label class="relative block">
        <span class="mb-2 block text-sm text-slate-300">{{ $t("Order type") }}</span>
        <select
          :value="form.type"
          class="w-full appearance-none rounded-[14px] border border-white/15 bg-white/8 px-4 py-3 pr-10 text-sm text-white outline-none transition focus:border-amber-300 focus:ring-2 focus:ring-amber-300/30"
          @change="$emit('update:form', { ...form, type: ($event.target as HTMLSelectElement).value })"
        >
          <option class="text-slate-900" value="TAKEAWAY">{{ $t("Takeaway") }}</option>
          <option class="text-slate-900" value="DELIVERY">{{ $t("Delivery") }}</option>
          <option class="text-slate-900" value="IN_STORE">{{ $t("In store") }}</option>
        </select>
        <span class="pointer-events-none absolute inset-y-0 right-4 flex items-center text-slate-300">
          ▾
        </span>
      </label>
      <label class="relative block">
        <span class="mb-2 block text-sm text-slate-300">{{ $t("Payment method") }}</span>
        <select
          :value="form.paymentMethod"
          class="w-full appearance-none rounded-[14px] border border-white/15 bg-white/8 px-4 py-3 pr-10 text-sm text-white outline-none transition focus:border-amber-300 focus:ring-2 focus:ring-amber-300/30"
          @change="$emit('update:form', { ...form, paymentMethod: ($event.target as HTMLSelectElement).value })"
        >
          <option class="text-slate-900" value="CASH">{{ $t("Cash") }}</option>
          <option class="text-slate-900" value="CARD">{{ $t("Card") }}</option>
          <option class="text-slate-900" value="MOBILE_MONEY">{{ $t("Mobile money") }}</option>
          <option class="text-slate-900" value="QR_CODE">{{ $t("QR code") }}</option>
          <option class="text-slate-900" value="OTHER">{{ $t("Other") }}</option>
        </select>
        <span class="pointer-events-none absolute inset-y-0 right-4 flex items-center text-slate-300">
          ▾
        </span>
      </label>
      <label class="space-y-2">
        <span class="text-sm text-slate-300">{{ $t("Order notes") }}</span>
        <el-input
          type="textarea"
          :rows="3"
          :model-value="form.notes"
          :placeholder="$t('Optional notes for the seller')"
          @update:model-value="$emit('update:form', { ...form, notes: String($event ?? '') })"
        />
      </label>
      </div>
    </div>

    <div class="rounded-2xl bg-white/8 p-4">
      <div class="flex items-center justify-between text-sm text-slate-300">
        <span>{{ $t("Subtotal") }}</span>
        <span>{{ formatMoney(subtotal) }}</span>
      </div>
      <div class="mt-1 flex items-center justify-between text-xs text-slate-400">
        <span>{{ $t("Converted") }}</span>
        <span>{{ formatAlternateMoney(subtotal) }}</span>
      </div>
      <div class="mt-3 flex items-center justify-between text-lg font-semibold text-white">
        <span>{{ $t("Total") }}</span>
        <span>{{ formatMoney(subtotal) }}</span>
      </div>
    </div>

    <el-button
      type="warning"
      size="large"
      class="w-full"
      :loading="submitting"
      :disabled="!cart.length"
      @click="$emit('submit')"
    >
      {{ $t("Place order") }}
    </el-button>
  </aside>
</template>

<script setup lang="ts">
import type { CatalogProductItem } from "~/model/order";
import { formatCurrency } from "~/utils/currencyFormat";

interface CartLine {
  product: CatalogProductItem;
  quantity: number;
}

defineProps<{
  cart: CartLine[];
  cartCount: number;
  subtotal: number;
  submitting: boolean;
  form: {
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    notes: string;
    type: string;
    paymentMethod: string;
  };
}>();

defineEmits<{
  (event: "remove", productId: number): void;
  (event: "quantity-change", productId: number, quantity: number): void;
  (event: "update:form", value: {
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    notes: string;
    type: string;
    paymentMethod: string;
  }): void;
  (event: "submit"): void;
}>();

const store = useAppStore();
const primaryCurrency = computed(() => store.currentCurrency.currencyBase || "USD");
const secondaryCurrency = computed(() =>
  primaryCurrency.value === "USD" ? "KHR" : "USD",
);

const formatMoney = (amount: number) => formatCurrency(amount, primaryCurrency.value);
const formatAlternateMoney = (amount: number) =>
  formatCurrency(amount, secondaryCurrency.value);
</script>
