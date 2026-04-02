import { PaymentStatus } from '~~/prisma/generated/enums';
export interface ISaleReportRequest {
    shopId: number;
    startDate: string;
    endDate: string;
    paymentStatus: PaymentStatus | "";
}
