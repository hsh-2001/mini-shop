<template>
  <div
    class="border bg-white rounded-md p-2 border-slate-200 h-[90dvh] overflow-hidden flex flex-col relative"
  >
    <div class="space-y-4 overflow-auto h-[calc(90dvh-7rem)] pr-2">
      <div class="flex items-start justify-between gap-3">
        <div>
          <p
            class="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700"
          >
            Current Order
          </p>
          <h2 class="mt-1 text-md font-semibold text-slate-900">
            Cashier Cart
          </h2>
          <p class="mt-1 text-[10px] text-slate-500">
            {{
              $t("Add products to the cart and customize the order details.")
            }}
          </p>
        </div>
        <div class="flex flex-col items-end gap-2">
          <el-tag type="info">{{ cartCount }} items</el-tag>
          <el-button
            v-if="cart.length"
            size="small"
            text
            type="danger"
            @click="$emit('clear-cart')"
          >
            {{ $t("Clear cart") }}
          </el-button>
        </div>
      </div>

      <div class="space-y-2 bg-slate-50 p-2 rounded-md">
        <div v-for="item in cart" :key="item.product.id" class="cart-line">
          <div class="flex items-start justify-between gap-3">
            <div class="min-w-0">
              <p class="truncate text-sm font-medium text-slate-900">
                {{ item.product.name }}
              </p>
            </div>
            <el-button
              text
              type="danger"
              size="small"
              @click="$emit('remove', item.product.id)"
            >
              <x class="h-4 w-4" />
            </el-button>
          </div>

          <div class="mt-3 flex items-center justify-between gap-3">
            <el-input-number
              :model-value="item.quantity"
              :min="1"
              :max="item.product.stock >= 0 ? item.product.stock : undefined"
              @update:model-value="
                $emit('quantity-change', item.product.id, Number($event ?? 1))
              "
            />
            <span class="text-sm font-semibold text-slate-900">
              ${{ (Number(item.product.basePrice) * item.quantity).toFixed(2) }}
            </span>
          </div>
        </div>

        <el-empty
          v-if="!cart.length"
          :image-size="50"
          class="my-0! p-0!"
          description="Add products to start this order."
        />
      </div>

      <el-divider class="my-0!" />

      <div class="space-y-2">
        <div>
          <p class="text-sm font-semibold text-slate-900">
            {{ $t("Customer") }}
          </p>
          <p class="mt-1 text-xs text-slate-500">
            {{ $t("Walk-in is the default. Extra details are optional.") }}
          </p>
        </div>

        <div class="grid gap-3">
          <el-input
            :model-value="form.customerName"
            size="small"
            placeholder="Walk-in customer"
            @update:model-value="
              $emit('update:form', {
                ...form,
                customerName: String($event ?? ''),
              })
            "
          />
          <el-input
            :model-value="form.customerPhone"
            placeholder="Phone"
            size="small"
            class="w-full"
            @update:model-value="
              $emit('update:form', {
                ...form,
                customerPhone: String($event ?? ''),
              })
            "
          />
        </div>
      </div>

      <div class="space-y-2">
        <div>
          <p class="text-sm font-semibold text-slate-900">
            {{ $t("Preferences") }}
          </p>
          <p class="mt-1 text-xs text-slate-500">
            {{ $t("Choose order type and payment method.") }}
          </p>
        </div>

        <div class="space-y-2">
          <span
            class="text-xs font-medium uppercase tracking-[0.12em] text-slate-500"
            >{{ $t("Order type") }}</span
          >
          <el-radio-group
            :model-value="form.type"
            size="small"
            @update:model-value="
              $emit('update:form', { ...form, type: $event as OrderType })
            "
          >
            <el-radio-button
              v-for="option in orderTypeOptions"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </el-radio-button>
          </el-radio-group>
        </div>

        <div
          class="text-xs font-medium uppercase tracking-[0.12em] text-slate-500"
        >
          {{ $t("Payment") }}
        </div>
        <el-radio-group
          :model-value="form.paymentMethod"
          size="small"
          @update:model-value="
            $emit('update:form', {
              ...form,
              paymentMethod: $event as PaymentMethod,
            })
          "
        >
          <el-radio-button
            v-for="option in paymentMethodOptions"
            :key="option.value"
            :value="option.value"
          >
            {{ option.label }}
          </el-radio-button>
        </el-radio-group>

        <el-input
          :model-value="form.notes"
          type="textarea"
          :rows="2"
          resize="none"
          placeholder="Notes for staff"
          @update:model-value="
            $emit('update:form', { ...form, notes: String($event ?? '') })
          "
        />
      </div>
    </div>
    <div class="absolute bottom-0 inset-x-2 pb-2 bg-white">
      <div class="total-panel">
        <div class="flex items-center justify-between text-sm text-slate-500">
          <span>Subtotal</span>
          <span>${{ subtotal.toFixed(2) }}</span>
        </div>
        <div
          class="mt-2 flex items-center justify-between text-base font-semibold text-slate-900"
        >
          <span>Total</span>
          <span>${{ subtotal.toFixed(2) }}</span>
        </div>
      </div>

      <div>
        <el-button
          type="primary"
          class="w-full! mt-auto"
          :loading="submitting"
          :disabled="!cart.length"
          @click="$emit('submit')"
        >
          {{ $t("Submit order") }}
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { OrderType, PaymentMethod } from "~~/prisma/generated/enums";
import type { ProductItem } from "~/model/inventory";
import type { CashierOrderForm } from "~/model/order";
import { X } from "@lucide/vue";

interface CartLine {
  product: ProductItem;
  quantity: number;
}

const orderTypeOptions = [
  { label: "Takeaway", value: OrderType.TAKEAWAY },
  { label: "Delivery", value: OrderType.DELIVERY },
  { label: "In store", value: OrderType.IN_STORE },
];

const paymentMethodOptions = [
  { label: "Cash", value: PaymentMethod.CASH },
  // { label: "Card", value: PaymentMethod.CARD },
  // { label: "Mobile money", value: PaymentMethod.MOBILE_MONEY },
  { label: "QR code", value: PaymentMethod.QR_CODE },
  { label: "Other", value: PaymentMethod.OTHER },
];

defineProps<{
  cart: CartLine[];
  cartCount: number;
  subtotal: number;
  submitting: boolean;
  form: CashierOrderForm;
}>();

defineEmits<{
  (event: "remove", productId: number): void;
  (event: "quantity-change", productId: number, quantity: number): void;
  (event: "update:form", value: CashierOrderForm): void;
  (event: "clear-cart"): void;
  (event: "submit"): void;
}>();
</script>
