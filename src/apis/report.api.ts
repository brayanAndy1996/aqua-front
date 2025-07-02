import axios from 'axios';
import { ResponseReportVentas, filtersReportToVentas, ResponseReportCompras } from '@/types/report';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const reportApi = {
    getReportVentasByFilters: async (accessToken: string, filters: filtersReportToVentas): Promise<ResponseReportVentas> => {
        const response = await axios.get(`${API_URL}/reportes/ventas`, {
            headers: { Authorization: `Bearer ${accessToken}` },
            params: {
                ...filters
            }
        });
        return response.data;
    },
    getReportComprasByFilters: async (accessToken: string, filters: filtersReportToVentas): Promise<ResponseReportCompras> => {
        const response = await axios.get(`${API_URL}/reportes/compras`, {
            headers: { Authorization: `Bearer ${accessToken}` },
            params: {
                ...filters
            }
        });
        return response.data;
    },
}
