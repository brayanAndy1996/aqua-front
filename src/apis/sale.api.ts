import { ResponseSale } from '@/types/sale';
import { SaleItems } from '@/types/saleItems';
import { apiPost } from '@/lib/api/apiWrapper';

export const saleApi = {
    createSale: async (saleData: SaleItems[], userId: number | string): Promise<ResponseSale> => {
        return await apiPost<ResponseSale, { items: SaleItems[], user_id: number | string }>(`/ventas/crear-venta`, {
            items: saleData,
            user_id: userId
        });
    }
}
