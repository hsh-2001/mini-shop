<template>
  <div
    class="border bg-white rounded-md p-2 border-slate-200 h-[90dvh] overflow-hidden flex flex-col relative"
  >
    <div class="space-y-4 overflow-auto h-[calc(90dvh-8rem)]">
      <div class="flex items-start justify-between gap-3">
        <div>
          <p
            class="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700"
          >
            {{ $t("Current Order") }}
          </p>
          <h2 class="mt-1 text-md font-semibold text-slate-900">
            {{ $t("Cashier Cart") }}
          </h2>
          <p class="mt-1 text-[10px] text-slate-500">
            {{
              $t("Add products to the cart and customize the order details.")
            }}
          </p>
        </div>
        <div class="flex flex-col items-end gap-2">
          <el-tag type="info">{{ cartCount }} {{ $t("items") }}</el-tag>
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
        <div
          v-for="(item, index) in cart"
          :key="item.product.id"
          class="cart-line"
        >
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

          <div class="flex items-center justify-between gap-3">
            <el-input-number
              :model-value="item.quantity"
              :min="1"
              size="small"
              :max="item.product.stock >= 0 ? item.product.stock : undefined"
              @update:model-value="
                $emit('quantity-change', item.product.id, Number($event ?? 1))
              "
            />
            <span class="text-sm font-semibold text-slate-900">
              {{ formatMoney(Number(item.product.basePrice) * item.quantity) }}
            </span>
          </div>
          <div class="selected-modifier flex flex-col gap-1 mt-2">
            <div
              v-for="(modifiers, index) in item.product.selectedModifiers"
              :key="index"
              class="space-y-1 relative flex-col flex"
            >
              <el-divider class="my-1!" v-if="index !== 0" />
              <div
                v-for="(modifier, key) in modifiers"
                :key="key"
                class="flex items-center gap-1 text-xs text-slate-500"
              >
                <span class="w-16">{{ $t(String(key)) }}:</span>
                <template v-if="['sugar', 'ice'].includes(String(key))">
                  <el-input
                    v-model="item.product.selectedModifiers[index][key]"
                    @input="
                      item.product.selectedModifiers[index][key] =
                        formatInputNumber($event, false, { min: 0, max: 100 })
                    "
                    size="small"
                  >
                    <template #append>
                      <span> % </span>
                    </template>
                  </el-input>
                </template>
                <template v-else-if="String(key) === 'quantity'">
                  <el-input-number
                    v-model="item.product.selectedModifiers[index][key]"
                    :min="1"
                    :max="item.quantity - 1"
                    size="small"
                    class="w-full!"
                  />
                </template>
                <template v-else-if="String(key) === 'size'">
                  <el-radio-group
                    v-model="item.product.selectedModifiers[index][key]"
                    size="small"
                  >
                    <el-radio-button value="S">
                      {{ $t("S") }}
                    </el-radio-button>
                    <el-radio-button value="M">
                      {{ $t("M") }}
                    </el-radio-button>
                    <el-radio-button value="L">
                      {{ $t("L") }}
                    </el-radio-button>
                  </el-radio-group>
                </template>
              </div>
            </div>
            <el-button
              v-if="item.quantity > 1"
              type="primary"
              size="small"
              plain
              @click="$emit('add-item-modifier', item.product.id)"
            >
              <plus class="h-4 w-4" />
            </el-button>
          </div>
        </div>

        <el-empty
          v-if="!cart.length"
          :image-size="50"
          class="my-0! p-0!"
          :description="$t('Add products to start this order.')"
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
            v-model="formModel.customerName"
            size="small"
            :placeholder="$t('Walk-in customer')"
          />
          <el-input
            v-model="formModel.customerPhone"
            :placeholder="$t('Phone')"
            size="small"
            class="w-full"
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
          <el-radio-group v-model="formModel.type" size="small">
            <el-radio-button
              v-for="option in orderTypeOptions"
              :key="option.value"
              :value="option.value"
            >
              {{ $t(option.label) }}
            </el-radio-button>
          </el-radio-group>
        </div>

        <div
          class="text-xs font-medium uppercase tracking-[0.12em] text-slate-500"
        >
          {{ $t("Payment") }}
        </div>
        <el-radio-group v-model="formModel.paymentMethod" size="small">
          <el-radio-button
            v-for="option in paymentMethodOptions"
            :key="option.value"
            :value="option.value"
          >
            {{ $t(option.label) }}
          </el-radio-button>
        </el-radio-group>

        <div
          class="text-xs font-medium uppercase tracking-[0.12em] text-slate-500"
        >
          {{ $t("Payment status") }}
        </div>
        <el-radio-group v-model="formModel.paymentStatus" size="small">
          <el-radio-button
            v-for="option in paymentStatusOptions"
            :key="option.value"
            :value="option.value"
          >
            {{ $t(option.label) }}
          </el-radio-button>
        </el-radio-group>

        <el-input
          v-model="formModel.notes"
          type="textarea"
          :rows="2"
          resize="none"
          :placeholder="$t('Notes for staff')"
        />
      </div>
    </div>
    <div class="absolute bottom-0 inset-x-2 pb-2 bg-white">
      <div class="total-panel">
        <div class="flex items-center justify-between text-sm text-slate-500">
          <span>{{ $t("Subtotal") }}</span>
          <span>{{ formatMoney(subtotal) }}</span>
        </div>
        <div
          class="mt-1 flex items-center justify-between text-xs text-slate-400"
        >
          <span>{{ $t("Converted") }}</span>
          <span>{{ formatAlternateMoney(subtotal) }}</span>
        </div>
        <div
          class="mt-2 flex items-center justify-between text-base font-semibold text-slate-900"
        >
          <span>{{ $t("Total") }}</span>
          <span>{{ formatMoney(subtotal) }}</span>
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
import {
  OrderType,
  PaymentMethod,
  PaymentStatus,
} from "~~/prisma/generated/enums";
import type { ProductItem } from "~/model/inventory";
import type { CashierOrderForm } from "~/model/order";
import { Plus, X } from "@lucide/vue";
import { formatCurrency } from "~/utils/currencyFormat";
import product from "~~/server/api/product";

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
  { label: "QR code", value: PaymentMethod.QR_CODE },
  { label: "Other", value: PaymentMethod.OTHER },
];

const paymentStatusOptions = [
  { label: "Paid", value: PaymentStatus.PAID },
  { label: "Unpaid", value: PaymentStatus.UNPAID },
];

const props = defineProps<{
  cart: CartLine[];
  cartCount: number;
  subtotal: number;
  submitting: boolean;
  form: CashierOrderForm;
}>();

const emits = defineEmits<{
  (event: "remove", productId: number): void;
  (event: "quantity-change", productId: number, quantity: number): void;
  (event: "update:form", value: CashierOrderForm): void;
  (event: "clear-cart"): void;
  (event: "submit"): void;
  (event: "add-item-modifier", productId: number): void;
}>();

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

const formModel = computed({
  get() {
    return props.form;
  },
  set(value: CashierOrderForm) {
    emits("update:form", value);
  },
});
</script>
