<template>
  <div
    class="h-[calc(var(--vh,1vh)*100-60px)] w-full relative flex flex-col overflow-hidden"
  >
    <div class="flex flex-col md:flex-row gap-2 h-full">
      <div class="flex-1 overflow-auto">
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

      <div class="max-w-75 hidden md:block">
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

      <div class="md:hidden">
        <el-dialog
          v-model="showCart"
          :title="$t('Order_{cartCount}_items)', { cartCount })"
          top="5vh"
          width="100%"
          class="max-w-none! rounded-t-2xl!"
          :lock-scroll="true"
        >
          <div
            class="max-h-[80vh] overflow-auto pb-[env(safe-area-inset-bottom)]"
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
          </div>
        </el-dialog>
      </div>
    </div>
  </div>

  <button
    v-if="isMobile && cartCount > 0"
    class="fixed z-20 right-4 bg-primary text-white p-4 rounded-full shadow-lg active:scale-95 transition"
    :class="cartCount > 0 ? 'animate-bounce' : ''"
    :style="{
      bottom: `calc(env(safe-area-inset-bottom) + 16px)`,
    }"
    @click="showCart = true"
  >
    <ShoppingBag class="w-6 h-6" />

    <span
      class="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center"
    >
      {{ cartCount }}
    </span>
  </button>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, watch } from "vue";
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

const setVH = () => {
  document.documentElement.style.setProperty(
    "--vh",
    `${window.innerHeight * 0.01}px`,
  );
};

onMounted(() => {
  setVH();
  window.addEventListener("resize", setVH);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", setVH);
});

watch(showCart, (val) => {
  document.body.style.overflow = val ? "hidden" : "";
});
</script>

<style scoped>
* {
  -webkit-overflow-scrolling: touch;
}
</style>
