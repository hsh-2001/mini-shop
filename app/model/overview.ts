export interface IOverview {
    total_sales: number;
    total_orders: number;
    total_products: number;
    past_7_days_sales: Past7DaysSales[];
}

interface IPast7DaysSales {
    day: string;
    sales: number;
}

class Past7DaysSales implements IPast7DaysSales {
    day: string;
    sales: number;

    constructor(data: IPast7DaysSales) {
        this.day = data.day;
        this.sales = data.sales;
    }

    get salesForDisplay(): string {
        return formatCurrency(this.sales);
    }
}

export class Overview implements IOverview {
    total_sales: number;
    total_orders: number;
    total_products: number;
    past_7_days_sales: Past7DaysSales[];

    constructor(data: IOverview) {
        this.total_sales = data.total_sales;
        this.total_orders = data.total_orders;
        this.total_products = data.total_products;
        this.past_7_days_sales = data.past_7_days_sales.map(item => new Past7DaysSales(item));
    }

    get totalSalesForDisplay(): string {
        return formatCurrency(this.total_sales);
    }
}