import { OrderStatus, PaymentStatus } from "~~/prisma/generated/enums";
import { GetOrderSummaryListResponse } from "~/model/order";
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
    const route = useRoute();
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
    const filterForm = reactive<{
        dateFilterMode: 'ALL' | 'PERIOD';
        dateFrom: string;
        dateTo: string;
        status: OrderStatus[];
    }>({
        dateFilterMode: 'ALL',
        dateFrom: '',
        dateTo: '',
        status: [],
    });
    const shopIdentity = ref<{
        shopName: string | null;
        username: string | null;
    }>({
        shopName: null,
        username: null,
    });
    const isDownloading = ref(false);
    const editForm = ref<{
        status: OrderStatus;
        paymentStatus: PaymentStatus;
        notes: string;
    }>({
        status: OrderStatus.PENDING,
        paymentStatus: PaymentStatus.UNPAID,
        notes: "",
    });
    const shopLabel = computed(() => {
        if (isLoading.value && !shopIdentity.value.shopName && !shopIdentity.value.username) {
            return t("Loading shop...");
        }

        return shopIdentity.value.shopName ?? shopIdentity.value.username ?? t("Current Shop");
    });

    const openOrder = (order: GetOrderSummaryListResponse) => {
        selectedOrder.value = order;
        isDialogOpen.value = true;
        editForm.value = {
            status: order.status,
            paymentStatus: order.paymentStatus,
            notes: order.notes ?? "",
        };
    };

    const resetFilters = () => {
        searchKeyword.value = "";
        statusFilter.value = "ALL";
        paymentStatusFilter.value = "ALL";
        filterForm.dateFilterMode = 'ALL';
        filterForm.dateFrom = '';
        filterForm.dateTo = '';
        filterForm.status = [];
        currentPage.value = 1;
    };

    const loadOrders = async () => {
        isLoading.value = true;
        try {
            const notif = route.query.notif as string | undefined;

            let paymentStatusParam: PaymentStatus | undefined;
            let statusParam: string | undefined;

            if (notif === "pending") {
                statusParam = OrderStatus.PENDING;
                filterForm.status = [OrderStatus.PENDING];
            } else if (notif === "unpaid") {
                paymentStatusParam = PaymentStatus.UNPAID;
                filterForm.status = [];
            } else {
                filterForm.status = [];
            }

            const [user, response] = await Promise.all([
                fetchCurrentUser(),
                fetchOrders({
                    dateFrom: filterForm.dateFilterMode === 'PERIOD' && filterForm.dateFrom ? filterForm.dateFrom : undefined,
                    dateTo: filterForm.dateFilterMode === 'PERIOD' && filterForm.dateTo ? filterForm.dateTo : undefined,
                    status: statusParam ?? (filterForm.status.length ? filterForm.status.join(',') : undefined),
                    paymentStatus: paymentStatusParam,
                }),
            ]);

            if (!response.isSuccess) {
                throw new Error(response.message);
            }

            shopIdentity.value = {
                shopName: user?.shop?.name ?? null,
                username: user?.username ?? null,
            };
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

    watch(() => route.query.notif, () => {
        loadOrders();
    });

    onMounted(loadOrders);

    const exportCSV = async () => {
        isDownloading.value = true;
        try {
            await downLoadCSV("orders", "order");
        } catch (error) {
            console.error("Failed to export orders:", error);
        }
        isDownloading.value = false;
    };

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
        openOrder,
        resetFilters,
        saveOrder,
        exportCSV,
        isDownloading,
        filterForm,
        loadOrders,
    };
};
