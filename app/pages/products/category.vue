<template>
  <section class="space-y-6">
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
    <ClientOnly>
      <CategoryDialog
        :open="isDialogOpen"
        :saving="isSaving"
        :form="form"
        @update:open="isDialogOpen = $event"
        @closed="resetForm"
        @update:form="setForm"
        @submit="submitCategory"
      />
    </ClientOnly>
  </section>
</template>

<script setup lang="ts">
import CategoryTableSection from "~/components/products/CategoryTableSection.vue";
import CategoryDialog from "~/components/products/CategoryDialog.vue";

const {
  categories,
  isLoading,
  isSaving,
  isDialogOpen,
  currentPage,
  pageSize,
  form,
  pagedCategories,
  setForm,
  resetForm,
  openCreateDialog,
  editCategory,
  submitCategory,
  getAllCategories,
} = useCategoriesPage();

onMounted(getAllCategories);
</script>

<style scoped></style>
