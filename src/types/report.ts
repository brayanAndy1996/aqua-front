import { SaleItems } from "./saleItems";
import { PurchaseInterface } from "./purchase";
export interface Report {
    id: number;
    name: string;
    description: string;
    created_at: string;
    updated_at: string;
}

export interface ResponseReportVentas {
    count?: number;
    message: string;
    data: {
        sales: SaleItems[];
        totalSalesItems: number;
        totalAmount: number;
    }
}

export interface ResponseReportCompras {
    count?: number;
    message: string;
    data: {
        purchases: PurchaseInterface[];
        totalPurchaseItems: number;
        totalAmount: number;
    }
}

export interface filtersReportToVentas {
    productId?: number;
    startDate?: string;
    endDate?: string;
    userId?: number;
}