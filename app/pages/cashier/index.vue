<template>
  <div class="max-h-screen w-full overflow-auto">
    <section class="space-y-4 h-full">
      <CashierPageHeader
        :shop-label="shopLabel"
        :cart-count="cartCount"
        :cart-line-count="cartLineCount"
        :product-count="filteredProducts.length"
        :selected-category-id="selectedCategoryId"
        :categories="categories"
      />
      <div class="grid gap-4 xl:grid-cols-[minmax(0,1.55fr)_380px]">
        <CashierCatalogSection
          :loading="isLoading"
          :search="search"
          :selected-category-id="selectedCategoryId"
          :categories="categories"
          :products="filteredProducts"
          @update:search="search = $event"
          @update:selected-category-id="selectedCategoryId = $event"
          @add="addToCart"
        />

        <CashierOrderSidebar
          :cart="cart"
          :cart-count="cartCount"
          :subtotal="subtotal"
          :submitting="isSubmitting"
          :form="form"
          @remove="removeFromCart"
          @quantity-change="updateCartQuantity"
          @update:form="form = $event"
          @clear-cart="clearCart"
          @submit="submitOrder"
        />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import CashierCatalogSection from "~/components/cashier/CashierCatalogSection.vue";
import CashierOrderSidebar from "~/components/cashier/CashierOrderSidebar.vue";
import CashierPageHeader from "~/components/cashier/CashierPageHeader.vue";

const {
  shopLabel,
  categories,
  search,
  selectedCategoryId,
  cart,
  form,
  isLoading,
  isSubmitting,
  filteredProducts,
  cartCount,
  cartLineCount,
  subtotal,
  addToCart,
  updateCartQuantity,
  removeFromCart,
  clearCart,
  submitOrder,
} = useCashierPage();
</script>
