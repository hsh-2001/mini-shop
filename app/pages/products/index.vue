<template>
  <section class="space-y-6">
    <ProductPageHeader :shop-label="shopLabel" />
    <ProductTableSection
      :items="pagedProducts"
      :total="products.length"
      :loading="isLoading"
      :keyword="keyword"
      :current-page="currentPage"
      :page-size="pageSize"
      :can-create="canCreate"
      @update:keyword="keyword = $event"
      @update:current-page="currentPage = $event"
      @update:page-size="pageSize = $event"
      @create="openCreateDialog"
      @edit="editProduct"
      @delete="removeProduct"
    />
    <ProductDialog
      :open="isDialogOpen"
      :saving="isSaving"
      :can-create="canCreate"
      :categories="categories"
      :form="form"
      @update:open="isDialogOpen = $event"
      @closed="resetForm"
      @update:form="setForm"
      @submit="submitProduct"
    />
  </section>
</template>

<script setup lang="ts">
import ProductPageHeader from "~/components/products/ProductPageHeader.vue";
import ProductTableSection from "~/components/products/ProductTableSection.vue";
import ProductDialog from "~/components/products/ProductDialog.vue";

const {
  categories,
  products,
  isLoading,
  isSaving,
  isDialogOpen,
  keyword,
  currentPage,
  pageSize,
  shopLabel,
  form,
  pagedProducts,
  canCreate,
  setForm,
  resetForm,
  openCreateDialog,
  editProduct,
  submitProduct,
  removeProduct,
} = useProductsPage();
</script>

<style scoped></style>
