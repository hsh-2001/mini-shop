import { OrderStatus, PaymentStatus } from "~~/prisma/generated/enums";
import { GetOrderSummaryListResponse, type IOrderSummary } from "~/model/order";
import { fetchCurrentUser, fetchOrders, updateOrder } from "~/utils/apiCalling";
import { showFeedback } from "~/utils/feedback";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import axios from "axios";

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

    const exportExcelJS = async () => {
        try {
            const response = await axios.get("/api/export/csv?page=order", {
                responseType: "blob",
            });

            const blob = new Blob([response.data], { type: "text/csv" });
            const fileName = `orders_${new Date().toISOString().split("T")[0]}.csv`;
            saveAs(blob, fileName);
        } catch (error) {
            console.error("Failed to export orders:", error);
        }

        return;
        // const workbook = new ExcelJS.Workbook();
        // const sheet = workbook.addWorksheet("Sales");
        // sheet.columns = [
        //     { header: "Order Id", key: "orderId", width: 20 },
        //     { header: "Customer Name", key: "customerName", width: 25 },
        //     { header: "Customer Phone", key: "customerPhone", width: 20 },
        //     { header: "Customer Email", key: "customerEmail", width: 30 },
        //     { header: "Status", key: "status", width: 15 },
        //     { header: "Payment Status", key: "paymentStatus", width: 18 },
        //     { header: "Type", key: "type", width: 15 },
        //     { header: "Final Amount", key: "finalAmount", width: 15 },
        //     { header: "Created On", key: "createdOn", width: 20 },
        // ];
        // const headerRow = sheet.getRow(1);
        // headerRow.eachCell((cell) => {
        //     cell.font = {
        //         bold: true,
        //         size: 14,
        //         color: { argb: "FFFFFFFF" },
        //     };
        //     cell.fill = {
        //         type: "pattern",
        //         pattern: "solid",
        //         fgColor: { argb: "FF4F81BD" },
        //     };

        //     cell.alignment = {
        //         vertical: "middle",
        //         horizontal: "center",
        //     };
        //     cell.border = {
        //         top: { style: "thin" },
        //         left: { style: "thin" },
        //         bottom: { style: "thin" },
        //         right: { style: "thin" },
        //     };
        // });

        // orders.value.forEach((order) => {
        //     sheet.addRow({
        //         orderId: order.id,
        //         customerName: order.customer?.name || "Walk-in guest",
        //         customerPhone: order.customer?.phone || "",
        //         customerEmail: order.customer?.email || "",
        //         status: order.status,
        //         paymentStatus: order.paymentStatus,
        //         type: order.type,
        //         finalAmount: order.finalAmount,
        //         createdOn: order.formattedCreatedOn,
        //     });
        // });

        // sheet.getColumn('paymentStatus').eachCell((cell, rowNumber) => {
        //     if (rowNumber === 1) return;

        //     cell.fill = {
        //         type: "pattern",
        //         pattern: "solid",
        //         fgColor: { argb: "FFFCE4D6" },
        //     };
        //     cell.alignment = {
        //         vertical: "middle",
        //         horizontal: "right",
        //     }
        // });


        // const buffer = await workbook.xlsx.writeBuffer();

        // saveAs(new Blob([buffer]), "sales.xlsx");
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
        filteredOrders,
        pagedOrders,
        overviewStats,
        openOrder,
        resetFilters,
        saveOrder,
        exportExcelJS,
    };
};
