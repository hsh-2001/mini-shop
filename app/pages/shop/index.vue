<template>
  <div class="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(251,191,36,0.18),_transparent_35%),linear-gradient(180deg,_#fff7ed_0%,_#ffffff_42%,_#f8fafc_100%)] px-4 py-6 lg:px-8 lg:py-8">
    <div class="mx-auto grid max-w-7xl gap-6 xl:grid-cols-[1.45fr_0.8fr]">
      <div class="space-y-6">
        <GuestOrderHeader :shop="catalog.shop" />
        <GuestCatalogSection
          :loading="isLoading"
          :search="search"
          :selected-category-id="selectedCategoryId"
          :categories="catalog.categories"
          :products="filteredProducts"
          @update:search="search = $event"
          @update:selected-category-id="selectedCategoryId = $event"
          @add="addToCart"
        />
      </div>

      <GuestCheckoutSidebar
        :cart="cart"
        :cart-count="cartCount"
        :subtotal="subtotal"
        :submitting="isSubmitting"
        :form="checkoutForm"
        @remove="removeFromCart"
        @quantity-change="updateCartQuantity"
        @update:form="checkoutForm = $event"
        @submit="submitOrder"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import GuestCatalogSection from "~/components/orders/GuestCatalogSection.vue";
import GuestCheckoutSidebar from "~/components/orders/GuestCheckoutSidebar.vue";
import GuestOrderHeader from "~/components/orders/GuestOrderHeader.vue";

definePageMeta({
  layout: "guest",
});

const {
  catalog,
  isLoading,
  isSubmitting,
  selectedCategoryId,
  search,
  cart,
  checkoutForm,
  filteredProducts,
  cartCount,
  subtotal,
  addToCart,
  updateCartQuantity,
  removeFromCart,
  submitOrder,
} = useGuestOrderPage();
</script>
