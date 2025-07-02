import React, { useEffect, useRef, useState } from 'react';
import { Button, Tooltip } from '@heroui/react';
import styles from '@/app/styles/glassStyles.module.css';
import { showWarningToast } from '@/components/toastUtils';
import { formatPrice } from '@/lib/utils/functions';
import { CartSummaryProps, ExtendedProduct, CartItem } from '@/types/product';
import { useDisclosure } from "@heroui/react";
import CheckoutLoading from './CheckoutLoading';
import { saleApi } from '@/apis/sale.api';
import { SaleItems } from '@/types/saleItems';


const CartSummary: React.FC<CartSummaryProps> = ({
  cart,
  totalPrice,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onCheckout,
  getSubtotal,
  getIGV,
  token,
  idUser,
  refetch
}) => {
  const { isOpen, onClose, onOpen, onOpenChange } = useDisclosure();
  const [checkoutProgress, setCheckoutProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [checkoutStatus, setCheckoutStatus] = useState<"loading" | "success" | "error">("loading");
  const prevCartRef = useRef<CartItem[]>(cart);
  
  useEffect(() => {
    if (prevCartRef.current.length === 0) {
      prevCartRef.current = [...cart];
      return;
    }

    cart.forEach(item => {
      const prevItem = prevCartRef.current.find(i => i.product.id === item.product.id);
      if (!prevItem) return; 
      
      if (item.quantity > prevItem.quantity) {
        const otherItemsQuantity = cart
          .filter(i => i.product.id !== item.product.id)
          .reduce((total, i) => total + i.quantity, 0);
          
        const availableStock = item.product.current_stock - otherItemsQuantity;
        
        if (item.quantity > availableStock) {
          showWarningToast('Advertencia', `No hay suficiente stock disponible. Stock restante: ${availableStock}`);
        }
      }
    });
    
    prevCartRef.current = [...cart];
  }, [cart]);
  
  const getRemainingStock = (item: CartItem) => {
    const extendedProduct = item.product as ExtendedProduct;
    const originalStock = extendedProduct.original_stock !== undefined ? 
      extendedProduct.original_stock : 
      item.product.current_stock;
      
    const otherItemsQuantity = cart
      .filter(i => i.product.id !== item.product.id)
      .reduce((total, i) => total + i.quantity, 0);
    
    return originalStock - otherItemsQuantity;
  };

  const subtotal = getSubtotal();
  const igv = getIGV();
  const discount = 0;
  const serviceCharge = 0;
  const finalTotal = totalPrice - discount + serviceCharge;

  const handleProcesarVenta = async () => {
    try {
      setIsProcessing(true);
      setCheckoutStatus("loading");
      setCheckoutProgress(25);
      onOpen();
      
      const saleItems: SaleItems[] = cart.map(item => ({
        product_id: item.product.id,
        quantity: item.quantity,
        unit_price: item.product.sale_price,
        subtotal: item.product.sale_price * item.quantity
      }));
      
      setCheckoutProgress(50);
      
      const responseSale = await saleApi.createSale(token, saleItems, idUser);
      console.log("🚀 ~ handleProcesarVenta ~ responseSale:", responseSale)
      
      setCheckoutProgress(100);
      
      
      setCheckoutStatus("success");
      refetch();
    } catch (error) {
      console.error("Error processing sale:", error);
      setCheckoutProgress(100);
      setCheckoutStatus("error");
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleContinue = () => {
    onClose();
    setIsProcessing(false);
    onCheckout();
  };

  return (
    <>  
      <CheckoutLoading 
        isOpen={isOpen} 
        onOpenChange={onOpenChange}
        progress={checkoutProgress}
        status={checkoutStatus}
        onContinue={handleContinue}
      />
      <div className={`${styles.glassCard} p-6 h-fit sticky top-4`}>
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Resumen de Compra</h2>
        </div>
        
        {/* Cart Items */}
        <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
          {cart.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-2">🛒</div>
              <p>Tu carrito está vacío</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.product.id} className="border-b border-gray-200 pb-3">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-sm text-gray-800 flex-1">
                    {item.product.name}
                  </h4>
                  <Button
                    isIconOnly
                    size="sm"
                    variant="light"
                    color="danger"
                    onPress={() => onRemoveItem(item.product.id)}
                    className="ml-2"
                  >
                    ×
                  </Button>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Button
                      isIconOnly
                      size="sm"
                      radius="full"
                      variant="bordered"
                      onPress={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                      className="min-w-6 h-6"
                    >
                      -
                    </Button>
                    <span className="text-sm font-medium w-4 text-center">
                      {item.quantity}
                    </span>
                    <Tooltip
                      content="Stock agotado"
                      isDisabled={getRemainingStock(item) > 0}
                      placement="top"
                    >
                      <Button
                        isIconOnly
                        size="sm"
                        radius="full"
                        variant="bordered"
                        onPress={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                        className="min-w-6 h-6"
                        isDisabled={getRemainingStock(item) <= 0}
                      >
                        +
                      </Button>
                    </Tooltip>
                  </div>
                  <span className="font-semibold text-green-600">
                    {formatPrice(item.product.sale_price * item.quantity)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Summary */}
        {cart.length > 0 && (
          <>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>IGV (18%)</span>
                <span>{formatPrice(igv)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Descuento</span>
                <span>{formatPrice(discount)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Cargo por servicio</span>
                <span>{formatPrice(serviceCharge)}</span>
              </div>
              <div className="border-t pt-2">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>{formatPrice(finalTotal)}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                onPress={handleProcesarVenta}
                fullWidth
                size="lg"
                radius="full"
                color="success"
                variant="shadow"
                className="font-semibold p-4"
                isDisabled={isProcessing}
              >
                {isProcessing ? 'Procesando...' : `Procesar Venta ${formatPrice(finalTotal)}`}
              </Button>
              
              <div className="flex gap-2">
                <Button
                  onPress={() => window.print()}
                  fullWidth
                  size="md"
                  radius="full"
                  variant="flat"
                  color="default"
                  className="font-medium p-4"
                >
                  Imprimir
                </Button>
                <Button
                  onPress={onClearCart}
                  fullWidth
                  size="md"
                  radius="full"
                  color="warning"
                  variant="flat"
                  className="font-medium p-4"
                >
                  Limpiar
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default CartSummary;
