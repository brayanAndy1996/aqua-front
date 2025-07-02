import { useState, useMemo } from 'react';
import useSWR from 'swr';
import { Product } from '@/types/product';
import { productApi } from '@/apis/product.api';
import { useSession } from 'next-auth/react';
import { showWarningToast } from '@/components/toastUtils';
import { CartItem } from '@/types/product';

export const useProducts = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const { data: session, status  } = useSession();

  const key = useMemo(() => {
    if (status !== 'authenticated' || !session?.user?.accessToken) return null;
    return ['products', session.user.accessToken];
  }, [session, status]);

  const productFetcher = async ([, token]: [string, string]) => {
    const response = await productApi.getProducts(token);
    return response.data.filter(product => product.is_active);
  };

  const { data: originalProducts = [], error, isLoading, mutate } = useSWR(
    key,
    productFetcher,
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      dedupingInterval: 10000, // 10 seconds
    }
  );

  const products = useMemo(() => {
    if (!originalProducts.length) return [];

    return originalProducts.map(product => {
      const cartItem = cart.find(item => item.product.id === product.id);
      const quantityInCart = cartItem ? cartItem.quantity : 0;

      return {
        ...product,
        current_stock: product.current_stock - quantityInCart,
        original_stock: product.current_stock 
      };
    });
  }, [originalProducts, cart]);
  
  const handleComprar = () => {
    if (cart.length === 0) {
      alert('El carrito está vacío');
      return;
    }
    clearCart();
  };
  const addToCart = (product: Product, quantity: number = 1) => {
    let shouldShowToast = false;
    let availableStock = 0;
    const originalProduct = originalProducts.find(p => p.id === product.id);
    if (!originalProduct) return;

    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.product.id === product.id);
      const currentQuantityInCart = existingItem ? existingItem.quantity : 0;

      // Use original stock value for validation
      availableStock = originalProduct.current_stock - currentQuantityInCart;

      // If trying to add more than available in stock, don't update the cart
      if (quantity > availableStock) {
        shouldShowToast = true;
        return prevCart;
      }

      if (existingItem) {
        return prevCart.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Use the original product to ensure we have the correct data
        return [...prevCart, { product: originalProduct, quantity }];
      }
    });

    // Show toast after state update if needed
    if (shouldShowToast) {
      // Use setTimeout to ensure this runs after the state update
      setTimeout(() => {
        showWarningToast('Advertencia', `No hay suficiente stock disponible. Stock restante: ${availableStock}`);
      }, 0);
    }
  };

  const removeFromCart = (productId: number) => {
    setCart(prevCart => prevCart.filter(item => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: number, quantity: number) => {
    setCart(prevCart => {
      if (quantity <= 0) {
        return prevCart.filter(item => item.product.id !== productId);
      }

      const itemToUpdate = prevCart.find(item => item.product.id === productId);
      if (!itemToUpdate) return prevCart;

      const originalProduct = originalProducts.find(p => p.id === productId);
      if (!originalProduct) return prevCart;

      const otherItemsQuantity = prevCart
        .filter(item => item.product.id !== productId)
        .reduce((total, item) => total + item.quantity, 0);

      const availableStock = originalProduct.current_stock - otherItemsQuantity;

      if (quantity > availableStock) {
        return prevCart.map(item =>
          item.product.id === productId
            ? { ...item, quantity: availableStock }
            : item
        );
      }

      return prevCart.map(item =>
        item.product.id === productId
          ? { ...item, quantity }
          : item
      );
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  const calculateSubtotal = (price: number) => {
    return price / 1.18;
  };

  const calculateIGV = (price: number) => {
    return price - calculateSubtotal(price);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.product.sale_price * item.quantity), 0);
  };
  const getSubtotal = () => {
    return calculateSubtotal(getTotalPrice());
  };

  const getIGV = () => {
    return calculateIGV(getTotalPrice());
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  return {
    products,
    loading: isLoading,
    error: error ? 'Error al cargar los productos' : null,
    cart,
    addToCart,
    handleComprar,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    getTotalPrice,
    getSubtotal,
    getIGV,
    getTotalItems,
    refetch: mutate,
    session
  };
};
