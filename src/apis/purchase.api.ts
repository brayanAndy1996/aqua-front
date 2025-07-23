import { ResponsePurchase, PurchaseInterface } from '@/types/purchase';
import { apiPost } from '@/lib/api/apiWrapper';


export const purchaseApi = {
    createPurchase: async (purchaseData: PurchaseInterface): Promise<ResponsePurchase> => {
        return await apiPost<ResponsePurchase, PurchaseInterface>(`/compras/crear-compra`, purchaseData);
    }
}
