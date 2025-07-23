import { Product } from "@/types/product";
import { useState, useCallback } from "react";
import { showSuccessToast } from "@/components/toastUtils";
import { purchaseApi } from "@/apis/purchase.api";
import { handleErrors } from "@/lib/utils/errors";

const useAddStock = (product: Product, refreshProducts: () => void, onClose: () => void) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [stateForm, setStateForm] = useState({
    stockToAdd: 0,
    purchase_price: 0,
  });

  const handleStockChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setStateForm({
      ...stateForm,
      [e.target.name]: isNaN(value) ? 0 : value,
    });
  }, [stateForm]);

  const handleAddStock = useCallback(async () => {
    if (stateForm.stockToAdd <= 0) {
      return;
    }

    setIsLoading(true);
    try {
      // API call to update stock
      const response = await purchaseApi.createPurchase({
        quantity: stateForm.stockToAdd,
        purchase_price: stateForm.purchase_price,
        product_id: product.id,
        notes: "Stock agregado"
      });


      showSuccessToast("Stock actualizado", response.message);
      refreshProducts();
      onClose();
    } catch (err) {
      handleErrors(err);
    } finally {
      setIsLoading(false);
    }
  }, [stateForm.stockToAdd, stateForm.purchase_price, product, refreshProducts, onClose]);

  return {
    stateForm,
    isLoading,
    handleStockChange,
    handleAddStock
  };
};

export default useAddStock;
