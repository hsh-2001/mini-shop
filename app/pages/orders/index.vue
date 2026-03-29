<template>
  <section class="space-y-6">
    <OrderTableSection
      :items="pagedOrders"
      :total="filteredOrders.length"
      :loading="isLoading"
      :current-page="currentPage"
      :page-size="pageSize"
      :search-keyword="searchKeyword"
      :status-filter="statusFilter"
      :payment-status-filter="paymentStatusFilter"
      @update:current-page="currentPage = $event"
      @update:page-size="pageSize = $event"
      @update:search-keyword="searchKeyword = $event"
      @update:status-filter="statusFilter = $event"
      @update:payment-status-filter="paymentStatusFilter = $event"
      @reset-filters="resetFilters"
      @view="openOrder"
    />
    <OrderDetailDialog
      :open="isDialogOpen"
      :saving="isSaving"
      :order="selectedOrder"
      :form="editForm"
      @update:open="isDialogOpen = $event"
      @update:form="editForm = $event"
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
  shopLabel,
  editForm,
  filteredOrders,
  pagedOrders,
  overviewStats,
  openOrder,
  resetFilters,
  saveOrder,
} = useOrdersPage();
</script>
