import { SaleReportResponse as SaleReportResponse } from "~/model/report";

export default function useReport() {

    const isLoading = ref(false);
    const filterForm = ref({
        startDate: new Date(new Date().setHours(0, 0, 0, 0)),
        endDate: new Date(new Date().setHours(23, 59, 59, 999)),
        paymentStatus: "",
        orderStatus: "",
    })

    const salesReport = ref<SaleReportResponse[]>([]);

    const getReport = async () => {
        isLoading.value = true;
        try {
            const response = await callGetSalesReport(filterForm.value);
            if (response.isSuccess) {
                console.log("Report data:", response.data);
                salesReport.value = response.data?.map(item => new SaleReportResponse(item));
            }
        } catch (error) {
            console.error("Failed to fetch report:", error);
        } finally {
            isLoading.value = false;
        }
    }

    return {
        getReport,
        salesReport,
        filterForm,
        isLoading,
    }
}