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
      </div>
  </div>
</template>

<script setup lang="ts">
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
} = useCashierPage();
const { isMobile } = deviceHelper();
</script>
