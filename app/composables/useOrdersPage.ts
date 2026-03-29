import { OrderStatus, PaymentStatus } from "~~/prisma/generated/enums";
import type { OrderSummary } from "~/model/order";
import { fetchCurrentUser, fetchOrders, updateOrder } from "~/utils/apiCalling";
import { showFeedback } from "~/utils/feedback";

const showError = (message: string) => {
    return showFeedback("error", message);
};

const showSuccess = (message: string) => {
    return showFeedback("success", message);
};

export const useOrdersPage = () => {
    const orders = ref<OrderSummary[]>([]);
    const isLoading = ref(true);
    const isSaving = ref(false);
    const currentPage = ref(1);
    const pageSize = ref(10);
    const statusFilter = ref<OrderStatus | "ALL">("ALL");
    const paymentStatusFilter = ref<PaymentStatus | "ALL">("ALL");
    const selectedOrder = ref<OrderSummary | null>(null);
    const isDialogOpen = ref(false);
    const shopLabel = ref("Loading shop...");
    const editForm = ref({
        status: OrderStatus.PENDING,
        paymentStatus: PaymentStatus.UNPAID,
        notes: "",
    });

    const pagedOrders = computed(() => {
        const start = (currentPage.value - 1) * pageSize.value;
        return orders.value.slice(start, start + pageSize.value);
    });

    const openOrder = (order: OrderSummary) => {
        selectedOrder.value = order;
        editForm.value = {
            status: order.status,
            paymentStatus: order.paymentStatus,
            notes: order.notes ?? "",
        };
        isDialogOpen.value = true;
    };

    const loadOrders = async () => {
        isLoading.value = true;
        try {
            const [user, response] = await Promise.all([
                fetchCurrentUser(),
                fetchOrders({
                    status: statusFilter.value === "ALL" ? undefined : statusFilter.value,
                    paymentStatus: paymentStatusFilter.value === "ALL" ? undefined : paymentStatusFilter.value,
                }),
            ]);

            if (!response.isSuccess) {
                throw new Error(response.message);
            }

            shopLabel.value = user?.shop?.name ?? user?.username ?? "Current Shop";
            orders.value = response.data ?? [];
            currentPage.value = 1;
        } catch (error) {
            await showError(error instanceof Error ? error.message : "Unable to load orders.");
        } finally {
            isLoading.value = false;
        }
    };

    const saveOrder = async () => {
        if (!selectedOrder.value) {
            return;
        }

        isSaving.value = true;
        try {
            const response = await updateOrder({
                id: selectedOrder.value.id,
                status: editForm.value.status,
                paymentStatus: editForm.value.paymentStatus,
                notes: editForm.value.notes,
            });

            if (!response.isSuccess) {
                throw new Error(response.message);
            }

            const index = orders.value.findIndex((item) => item.id === response.data.id);
            if (index >= 0) {
                orders.value.splice(index, 1, response.data);
                selectedOrder.value = response.data;
            }

            isDialogOpen.value = false;
            await showSuccess("Order updated.");
        } catch (error) {
            await showError(error instanceof Error ? error.message : "Unable to update order.");
        } finally {
            isSaving.value = false;
        }
    };

    watch([statusFilter, paymentStatusFilter], loadOrders);
    watch(pageSize, () => {
        currentPage.value = 1;
    });

    onMounted(loadOrders);

    return {
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
    };
};
