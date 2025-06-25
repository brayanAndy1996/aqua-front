
export interface Product {
  // Unique identifier for the product
  id: number;
  
  // Product code/sku
  code: string;
  
  // Product name
  name: string;
  
  // Detailed description of the product
  description: string | null;
  
  // Price at which the product is sold
  sale_price: number;
  
  // Cost price of the product
  purchase_price: number;
  
  // Current available quantity in stock
  current_stock: number;
  
  // Minimum stock level before reordering is needed
  min_stock: number;
  
  // Whether the product is active/available
  is_active: boolean;
  
  // Timestamp when the product was created
  created_at?: Date | string;
  
  // Timestamp when the product was last updated
  updated_at?: Date | string;
}

export interface ResponseProduct {
    count?: number;
    message: string;
    data: Product[];
}

export interface ResponseProductById {
  data: Product;
  message: string;
}

