import axios from 'axios';
import { ResponsePurchase, PurchaseInterface } from '@/types/purchase';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const purchaseApi = {
    createPurchase: async (accessToken: string, purchaseData: PurchaseInterface): Promise<ResponsePurchase> => {
        const response = await axios.post(`${API_URL}/compras/crear-compra`, {
            ...purchaseData
        }, {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        return response.data;
    }
}
