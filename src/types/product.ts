
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

//INTERFACES PARA EL VENTA DE PRODUCTOS
export interface CartItem {
  product: Product;
  quantity: number;
}
export interface ExtendedProduct extends Product {
  original_stock?: number;
}
export interface CartSummaryProps {
  cart: CartItem[];
  totalPrice: number;
  onUpdateQuantity: (productId: number, quantity: number) => void;
  onRemoveItem: (productId: number) => void;
  onClearCart: () => void;
  onCheckout: () => void;
  getSubtotal: () => number;
  getIGV: () => number;
  token: string;
  idUser: number | string;
  refetch: () => void;
}
export interface ProductGridProps {
  products: Product[];
  loading: boolean;
  error: string | null;
  onAddToCart: (product: Product) => void;
  cart: CartItem[];
}
export interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  cart: CartItem[];
}