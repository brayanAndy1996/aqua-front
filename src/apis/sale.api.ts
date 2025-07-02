import axios from 'axios';
import { ResponseSale } from '@/types/sale';
import { SaleItems } from '@/types/saleItems';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const saleApi = {
    createSale: async (accessToken: string, saleData: SaleItems[], userId: number | string): Promise<ResponseSale> => {
        const response = await axios.post(`${API_URL}/ventas/crear-venta`, {
            items: saleData,
            user_id: userId
        }, {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        return response.data;
    }
}
