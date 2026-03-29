<template>
  <section class="space-y-6">
    <OrderPageHeader :shop-label="shopLabel" />
    <OrderTableSection
      :items="pagedOrders"
      :total="orders.length"
      :loading="isLoading"
      :current-page="currentPage"
      :page-size="pageSize"
      :status-filter="statusFilter"
      :payment-status-filter="paymentStatusFilter"
      @update:current-page="currentPage = $event"
      @update:page-size="pageSize = $event"
      @update:status-filter="statusFilter = $event"
      @update:payment-status-filter="paymentStatusFilter = $event"
      @view="openOrder"
    />
    <ClientOnly>
      <OrderDetailDialog
        :open="isDialogOpen"
        :saving="isSaving"
        :order="selectedOrder"
        :form="editForm"
        @update:open="isDialogOpen = $event"
        @update:form="editForm = $event"
        @save="saveOrder"
      />
    </ClientOnly>
  </section>
</template>

<script setup lang="ts">
import OrderDetailDialog from "~/components/orders/OrderDetailDialog.vue";
import OrderPageHeader from "~/components/orders/OrderPageHeader.vue";
import OrderTableSection from "~/components/orders/OrderTableSection.vue";

const {
  orders,
  isLoading,
  isSaving,
  currentPage,
  pageSize,
  statusFilter,
  paymentStatusFilter,
  selectedOrder,
  isDialogOpen,
  shopLabel,
  editForm,
  pagedOrders,
  openOrder,
  saveOrder,
} = useOrdersPage();
</script>
