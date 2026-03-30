<template>
  <section>
    <OrderTableSection
      :items="pagedOrders"
      :total="filteredOrders.length"
      :loading="isLoading"
      v-model:search-keyword="searchKeyword"
      v-model:status-filter="statusFilter"
      v-model:payment-status-filter="paymentStatusFilter"
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      @reset-filters="resetFilters"
      @view="openOrder"
      @export="exportExcelJS"
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
  searchKeyword,
  statusFilter,
  paymentStatusFilter,
  selectedOrder,
  isDialogOpen,
  editForm,
  filteredOrders,
  pagedOrders,
  openOrder,
  resetFilters,
  saveOrder,
  exportExcelJS,
} = useOrdersPage();
</script>
