import { OrderStatus, PaymentStatus } from "~~/prisma/generated/enums";
import { GetOrderSummaryListResponse, type IOrderSummary } from "~/model/order";
import { fetchCurrentUser, fetchOrders, updateOrder } from "~/utils/apiCalling";
import { showFeedback } from "~/utils/feedback";

const showError = (message: string) => {
    return showFeedback("error", message);
};

const showSuccess = (message: string) => {
    return showFeedback("success", message);
};

export const useOrdersPage = () => {
    const { t } = useI18n();
    const orders = ref<GetOrderSummaryListResponse[]>([]);
    const isLoading = ref(true);
    const isSaving = ref(false);
    const currentPage = ref(1);
    const pageSize = ref(10);
    const searchKeyword = ref("");
    const statusFilter = ref<OrderStatus | "ALL">("ALL");
    const paymentStatusFilter = ref<PaymentStatus | "ALL">("ALL");
    const selectedOrder = ref<GetOrderSummaryListResponse | null>(null);
    const isDialogOpen = ref(false);
    const shopLabel = ref(t("Loading shop..."));
    const editForm = ref<{
        status: OrderStatus;
        paymentStatus: PaymentStatus;
        notes: string;
    }>({
        status: OrderStatus.PENDING,
        paymentStatus: PaymentStatus.UNPAID,
        notes: "",
    });

    const filteredOrders = computed(() => {
        const keyword = searchKeyword.value.trim().toLowerCase();

        if (!keyword) {
            return orders.value;
        }

        return orders.value.filter((order) => {
            const fields = [
                order.orderNumber,
                order.customer?.name,
                order.customer?.phone,
                order.customer?.email,
                order.status,
                order.paymentStatus,
                order.type,
            ];

            return fields.some((value) => value?.toString().toLowerCase().includes(keyword));
        });
    });

    const pagedOrders = computed(() => {
        const start = (currentPage.value - 1) * pageSize.value;
        return filteredOrders.value.slice(start, start + pageSize.value);
    });

    const overviewStats = computed(() => {
        const totalRevenue = filteredOrders.value.reduce(
            (sum, order) => sum + Number(order.finalAmount || 0),
            0,
        );
        const pendingCount = filteredOrders.value.filter((order) =>
            ["PENDING", "CONFIRMED", "PREPARING"].includes(order.status),
        ).length;
        const paidCount = filteredOrders.value.filter((order) => order.paymentStatus === "PAID").length;
        const today = new Date().toDateString();
        const todayCount = filteredOrders.value.filter(
            (order) => new Date(order.createdOn).toDateString() === today,
        ).length;

        return {
            totalOrders: filteredOrders.value.length,
            pendingCount,
            paidCount,
            todayCount,
            totalRevenue,
        };
    });

    const openOrder = (order: GetOrderSummaryListResponse) => {
        selectedOrder.value = order;
        editForm.value = {
            status: order.status,
            paymentStatus: order.paymentStatus,
            notes: order.notes ?? "",
        };
        isDialogOpen.value = true;
    };

    const resetFilters = () => {
        searchKeyword.value = "";
        statusFilter.value = "ALL";
        paymentStatusFilter.value = "ALL";
        currentPage.value = 1;
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

            shopLabel.value = user?.shop?.name ?? user?.username ?? t("Current Shop");
            orders.value = (response.data ?? []).map((order) => new GetOrderSummaryListResponse(order));
            currentPage.value = 1;
        } catch (error) {
            await showError(error instanceof Error ? error.message : t("Unable to load orders."));
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
                orders.value.splice(index, 1, new GetOrderSummaryListResponse(response.data));
                selectedOrder.value = new GetOrderSummaryListResponse(response.data);
            }

            isDialogOpen.value = false;
            await showSuccess(t("Order updated."));
        } catch (error) {
            await showError(error instanceof Error ? error.message : t("Unable to update order."));
        } finally {
            isSaving.value = false;
        }
    };

    watch([statusFilter, paymentStatusFilter], loadOrders);
    watch(pageSize, () => {
        currentPage.value = 1;
    });
    watch(searchKeyword, () => {
        currentPage.value = 1;
    });

    onMounted(loadOrders);

    return {
        orders,
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
    };
};
