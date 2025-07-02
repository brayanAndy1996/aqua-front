export interface PurchaseInterface {
    id?: number;
    product_id: number;
    quantity: number;
    purchase_price: number;
    user_id?: number;
    notes?: string;
}

export interface ResponsePurchase {
    data: PurchaseInterface;
    message: string;
}
