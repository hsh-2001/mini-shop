<template>
  <section class="space-y-6">
    <CategoryPageHeader :shop-label="shopLabel" />
    <CategoryTableSection
      :items="pagedCategories"
      :total="categories.length"
      :loading="isLoading"
      :current-page="currentPage"
      :page-size="pageSize"
      @update:current-page="currentPage = $event"
      @update:page-size="pageSize = $event"
      @create="openCreateDialog"
      @edit="editCategory"
    />
    <CategoryDialog
      :open="isDialogOpen"
      :saving="isSaving"
      :form="form"
      @update:open="isDialogOpen = $event"
      @closed="resetForm"
      @update:form="setForm"
      @submit="submitCategory"
    />
  </section>
</template>

<script setup lang="ts">
import CategoryPageHeader from "~/components/products/CategoryPageHeader.vue";
import CategoryTableSection from "~/components/products/CategoryTableSection.vue";
import CategoryDialog from "~/components/products/CategoryDialog.vue";

const {
  categories,
  isLoading,
  isSaving,
  isDialogOpen,
  currentPage,
  pageSize,
  shopLabel,
  form,
  pagedCategories,
  setForm,
  resetForm,
  openCreateDialog,
  editCategory,
  submitCategory,
} = useCategoriesPage();
</script>

<style scoped></style>
