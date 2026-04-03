<template>
  <div class="h-[calc(100dvh-60px)] w-full overflow-hidden">
    <div class="flex gap-2">
      <div class="w-full">
        <CashierCatalogSection
          :loading="isLoading"
          :search="search"
          :selected-category-id="selectedCategoryId"
          :categories="categories"
          :products="filteredProducts"
          @update:search="search = $event"
          @update:selected-category-id="selectedCategoryId = $event"
          @add="addToCart"
          @remove-from-cart="removeFromCart"
        />
      </div>

      <div class="max-w-75" v-if="!isMobile">
        <CashierOrderSidebar
          :cart="cart"
          :cart-count="cartCount"
          :subtotal="subtotal"
          :submitting="isSubmitting"
          v-model:form="form"
          @remove="removeFromCart"
          @quantity-change="updateCartQuantity"
          @clear-cart="clearCart"
          @submit="submitOrder"
          @add-item-modifier="addItemModifier"
        />
      </div>
      <div v-else>
        <el-dialog
          v-model="showCart"
          :title="$t('Order_{cartCount}_items)', { cartCount })"
          top="10px"
          :width="isMobile ? '90%' : '50%'"
        >
          <CashierOrderSidebar
            :cart="cart"
            :cart-count="cartCount"
            :subtotal="subtotal"
            :submitting="isSubmitting"
            v-model:form="form"
            @remove="removeFromCart"
            @quantity-change="updateCartQuantity"
            @clear-cart="clearCart"
            @submit="submitOrder"
            @add-item-modifier="addItemModifier"
          />
        </el-dialog>
      </div>
    </div>
  </div>
  <button
    v-if="isMobile && cartCount > 0"
    class="fixed z-10 bottom-10 right-4 bg-primary text-white p-3 rounded-full"
    :class="isMobile && cartCount > 0 ? 'animate-bounce' : ''"
    @click="showCart = true"
  >
    <ShoppingBag class="w-6 h-6" />
    <span
      v-if="cartCount > 0"
      class="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center"
    >
      {{ cartCount }}
    </span>
  </button>
</template>

<script setup lang="ts">
import { ShoppingBag } from "@lucide/vue";
import CashierCatalogSection from "~/components/cashier/CashierCatalogSection.vue";
import CashierOrderSidebar from "~/components/cashier/CashierOrderSidebar.vue";

const {
  categories,
  search,
  selectedCategoryId,
  cart,
  form,
  isLoading,
  isSubmitting,
  filteredProducts,
  cartCount,
  subtotal,
  addToCart,
  updateCartQuantity,
  removeFromCart,
  clearCart,
  submitOrder,
  addItemModifier,
  showCart,
} = useCashierPage();

const { isMobile } = deviceHelper();
</script>
