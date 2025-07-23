import { ResponseReportVentas, ResponseReportCompras } from '@/types/report';
import { apiGet, buildUrl } from '@/lib/api/apiWrapper';

export const reportApi = {
    getReportVentasByFilters: async (filters: { [key: string]: string | number | boolean } = {}): Promise<ResponseReportVentas> => {
        const url = buildUrl('/reportes/ventas', filters);
        return await apiGet<ResponseReportVentas>(url);
    },
    getReportComprasByFilters: async (filters: { [key: string]: string | number | boolean } = {}): Promise<ResponseReportCompras> => {
        const url = buildUrl('/reportes/compras', filters);
        return await apiGet<ResponseReportCompras>(url);
    },
}
