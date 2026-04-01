<template>
  <section>
    <OrderTableSection
      :items="orders"
      :loading="isLoading"
      :is-downloading="isDownloading"
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      v-model:filter-form="filterForm"
      @view="openOrder"
      @export="exportCSV"
      @search="loadOrders"
    />
    <OrderDetailDialog
      :saving="isSaving"
      :order="selectedOrder"
      v-model:form="editForm"
      v-model:open="isDialogOpen"
      @save="saveOrder"
    />
  </section>
</template>

<script setup lang="ts">
import OrderDetailDialog from "~/components/orders/OrderDetailDialog.vue";
import OrderTableSection from "~/components/orders/OrderTableSection.vue";

const {
  isLoading,
  isSaving,
  currentPage,
  pageSize,
  selectedOrder,
  isDialogOpen,
  editForm,
  openOrder,
  saveOrder,
  exportCSV,
  isDownloading,
  filterForm,
  orders,
  loadOrders,
} = useOrdersPage();
</script>
