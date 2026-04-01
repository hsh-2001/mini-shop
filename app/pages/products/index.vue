<template>
  <section class="space-y-6">
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
    <ClientOnly>
      <ProductDialog
        :saving="isSaving"
        :can-create="canCreate"
        :categories="categories"
        :form="form"
        v-model:product-file="productFile"
        v-model:open="isDialogOpen"
        @closed="resetForm"
        @update:form="setForm"
        @submit="submitProduct"
      />
    </ClientOnly>
  </section>
</template>

<script setup lang="ts">
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
  form,
  pagedProducts,
  canCreate,
  setForm,
  resetForm,
  openCreateDialog,
  editProduct,
  submitProduct,
  removeProduct,
  productFile,
} = useProductsPage();
</script>

<style scoped></style>
