import { ISaleReportRequest } from "~~/types/report";
import { getSalesReport } from "../repositories/report.repo";

export const getSalesReportService = async (param: ISaleReportRequest) => {
    const data = await getSalesReport(param);
    return data;
}