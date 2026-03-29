<template>
  <aside class="xl:sticky xl:top-16">
    <el-card shadow="never" class="cashier-surface border-0">
      <div class="space-y-4">
        <div class="flex items-start justify-between gap-3">
          <div>
            <p
              class="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700"
            >
              Current Order
            </p>
            <h2 class="mt-1 text-lg font-semibold text-slate-900">
              Cashier Cart
            </h2>
            <p class="mt-1 text-sm text-slate-500">
              Small, focused checkout for walk-in sales.
            </p>
          </div>
          <div class="flex flex-col items-end gap-2">
            <el-tag round type="info">{{ cartCount }} items</el-tag>
            <el-button
              v-if="cart.length"
              size="small"
              text
              type="danger"
              @click="$emit('clear-cart')"
            >
              Clear cart
            </el-button>
          </div>
        </div>

        <div class="space-y-2">
          <div v-for="item in cart" :key="item.product.id" class="cart-line">
            <div class="flex items-start justify-between gap-3">
              <div class="min-w-0">
                <p class="truncate text-sm font-medium text-slate-900">
                  {{ item.product.name }}
                </p>
                <p class="mt-1 text-xs text-slate-500">
                  ${{ Number(item.product.basePrice).toFixed(2) }} each
                </p>
              </div>
              <el-button
                text
                type="danger"
                size="small"
                @click="$emit('remove', item.product.id)"
              >
                Remove
              </el-button>
            </div>

            <div class="mt-3 flex items-center justify-between gap-3">
              <el-input-number
                :model-value="item.quantity"
                :min="1"
                :max="item.product.stock >= 0 ? item.product.stock : undefined"
                size="small"
                controls-position="right"
                @update:model-value="
                  $emit('quantity-change', item.product.id, Number($event ?? 1))
                "
              />
              <span class="text-sm font-semibold text-slate-900">
                ${{
                  (Number(item.product.basePrice) * item.quantity).toFixed(2)
                }}
              </span>
            </div>
          </div>

          <el-empty
            v-if="!cart.length"
            :image-size="72"
            description="Add products to start this order."
          />
        </div>

        <el-divider class="!my-1" />

        <div class="space-y-4">
          <div>
            <p class="text-sm font-semibold text-slate-900">Customer</p>
            <p class="mt-1 text-xs text-slate-500">
              Walk-in is the default. Extra details are optional.
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
            <div class="grid gap-3 sm:grid-cols-2">
              <el-input
                :model-value="form.customerPhone"
                size="small"
                placeholder="Phone"
                @update:model-value="
                  $emit('update:form', {
                    ...form,
                    customerPhone: String($event ?? ''),
                  })
                "
              />
              <el-input
                :model-value="form.customerEmail"
                size="small"
                placeholder="Email"
                @update:model-value="
                  $emit('update:form', {
                    ...form,
                    customerEmail: String($event ?? ''),
                  })
                "
              />
            </div>
          </div>
        </div>

        <div
          class="space-y-4 rounded-2xl border border-slate-200 bg-slate-50/70 p-3"
        >
          <div>
            <p class="text-sm font-semibold text-slate-900">Preferences</p>
            <p class="mt-1 text-xs text-slate-500">
              Choose order type and payment method.
            </p>
          </div>

          <div class="space-y-2">
            <span
              class="text-xs font-medium uppercase tracking-[0.12em] text-slate-500"
              >Order type</span
            >
            <el-radio-group
              :model-value="form.type"
              size="small"
              @update:model-value="
                $emit('update:form', { ...form, type: $event })
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

          <div class="space-y-2">
            <span
              class="text-xs font-medium uppercase tracking-[0.12em] text-slate-500"
              >Payment</span
            >
            <el-radio-group
              :model-value="form.paymentMethod"
              size="small"
              @update:model-value="
                $emit('update:form', { ...form, paymentMethod: $event })
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
          </div>

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

        <el-button
          type="success"
          size="default"
          class="!w-full"
          :loading="submitting"
          :disabled="!cart.length"
          @click="$emit('submit')"
        >
          Create order
        </el-button>
      </div>
    </el-card>
  </aside>
</template>

<script setup lang="ts">
import { OrderType, PaymentMethod } from "~~/prisma/generated/enums";
import type { ProductItem } from "~/model/inventory";
import type { CashierOrderForm } from "~/model/order";

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
  { label: "Card", value: PaymentMethod.CARD },
  { label: "Mobile money", value: PaymentMethod.MOBILE_MONEY },
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

<style scoped>
.cashier-surface :deep(.el-card__body) {
  padding: 16px;
}

.cashier-surface :deep(.el-radio-group) {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.cashier-surface :deep(.el-input__wrapper),
.cashier-surface :deep(.el-textarea__inner),
.cashier-surface :deep(.el-button),
.cashier-surface :deep(.el-tag),
.cashier-surface :deep(.el-card),
.cashier-surface :deep(.el-input-number),
.cashier-surface :deep(.el-input-number__decrease),
.cashier-surface :deep(.el-input-number__increase),
.cashier-surface :deep(.el-radio-button__inner) {
  border-radius: 0;
}

.cashier-surface :deep(.el-radio-button__inner) {
  font-size: 12px;
}

.cashier-surface :deep(.el-input-number) {
  width: 118px;
}

.cart-line {
  border: 1px solid rgb(226 232 240);
  padding: 12px;
  background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
}

.total-panel {
  border: 1px solid rgb(226 232 240);
  padding: 12px;
  background: linear-gradient(
    180deg,
    rgb(255 255 255) 0%,
    rgb(241 245 249) 100%
  );
}
</style>
