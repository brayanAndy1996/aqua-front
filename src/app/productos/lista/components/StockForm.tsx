import { Input, Button } from "@heroui/react";
import useAddStock from "../hooks/useAddStock";
import { Product } from "@/types/product";
const StockForm = ({product, refreshProducts, onClose}: {product: Product, refreshProducts: () => void, onClose: () => void}) => {
    const { 
        stateForm, 
        isLoading, 
        handleStockChange, 
        handleAddStock 
      } = useAddStock(product, refreshProducts, onClose);
    return (
        <div className="p-6">
        <div className="mb-4">
         <Input
            type="text"
            label="Nombre"
            value={product.name}
            disabled
         />
         <Input
            type="number"
            label="Stock Actual"
            value={product.current_stock.toString()}
            disabled
         />
        </div>
        
        <div className="mb-6">
          <Input
            type="number"
            name="stockToAdd"
            label="Cantidad a Agregar"
            min="1"
            value={stateForm.stockToAdd.toString()}
            onChange={handleStockChange}
            placeholder="Ingrese la cantidad"
            className="w-full"
          />
        </div>
        
        <div className="mb-6">
          <Input
            type="number"
            name="purchase_price"
            label="Precio de Compra"
            min="1"
            value={stateForm.purchase_price.toString()}
            onChange={handleStockChange}
            placeholder="Ingrese el precio de compra"
            className="w-full"
          />
        </div>
        
        <div className="flex justify-end gap-2">
          <Button 
            color="default" 
            variant="light" 
            onPress={onClose}
          >
            Cancelar
          </Button>
          <Button 
            color="primary" 
            onPress={handleAddStock}
            isLoading={isLoading}
            isDisabled={stateForm.stockToAdd <= 0 || isLoading}
          >
            Agregar Stock
          </Button>
        </div>
      </div>
    );
};

export default StockForm;
