import { SaleReportResponse as SaleReportResponse } from "~/model/report";

export default function useReport() {

    const isLoading = ref(false);
    const filterForm = ref({
        startDate: new Date(),
        endDate: new Date(),
        paymentStatus: "",
    })

    const salesReport = ref<SaleReportResponse[]>([]);

    const getReport = async () => {
        isLoading.value = true;
        try {
            const param = {
                startDate: filterForm.value.startDate.toISOString().split("T")[0],
                endDate: filterForm.value.endDate.toISOString().split("T")[0],
                paymentStatus: filterForm.value.paymentStatus,
            }
            const response = await callGetSalesReport(param);
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