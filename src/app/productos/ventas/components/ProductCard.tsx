import React, { useMemo } from 'react';
import { Card, CardHeader, CardBody, CardFooter, Button, Chip, Tooltip } from '@heroui/react';
import { PlusCircleIcon } from '@/lib/icons/navigation';
import styles from '@/app/styles/glassStyles.module.css';
import { formatPrice } from '@/lib/utils/functions';
import { ProductCardProps, ExtendedProduct } from '@/types/product';

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, cart }) => {
  const getRemainingStock = () => {
    const cartItem = cart.find(item => item.product.id === product.id);
    const currentQuantityInCart = cartItem ? cartItem.quantity : 0;
    const extendedProduct = product as ExtendedProduct;
    const originalStock = extendedProduct.original_stock !== undefined ? 
      extendedProduct.original_stock : 
      product.current_stock;

    return originalStock - currentQuantityInCart;
  };
  
  const canAddToCart = useMemo(() => product.current_stock > 0, [product.current_stock]);

  const getProductIcon = (name: string) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('clase') || lowerName.includes('entrenamiento')) {
      return '🏊‍♂️';
    } else if (lowerName.includes('gafa') || lowerName.includes('goggle')) {
      return '🥽';
    } else if (lowerName.includes('traje') || lowerName.includes('bañador')) {
      return '🩱';
    } else if (lowerName.includes('tabla') || lowerName.includes('kickboard')) {
      return '🏄‍♂️';
    } else if (lowerName.includes('aleta') || lowerName.includes('fin')) {
      return '🐠';
    } else if (lowerName.includes('toalla')) {
      return '🏖️';
    } else {
      return '🏊‍♀️';
    }
  };

  return (
    <Card className={`${styles.glassCard} m-2 transition-all duration-300 h-full`}>
      <CardHeader className="p-4 pb-0">
        <div className="text-center">
          <div className="text-6xl mb-2">
            {getProductIcon(product.name)}
          </div>
        </div>
      </CardHeader>
      
      <CardBody className="p-4 flex flex-col flex-grow">
        <h3 className="font-bold text-lg text-gray-800 mb-2 text-center">
          {product.name}
        </h3>
        
        {product.description && (
          <p className="text-sm text-gray-600 mb-3 text-center line-clamp-2">
            {product.description}
          </p>
        )}

        <div className="flex-grow flex flex-col justify-end">
          {/* Stock Info */}
          <div className="flex justify-center mb-3">
            <Chip 
              size="sm" 
              variant="flat"
              color={product.current_stock > product.min_stock ? 'success' : 'danger'}
              classNames={{
                base: 'font-medium',
                content: 'text-xs'
              }}
            >
              Stock: {product.current_stock}
            </Chip>
          </div>

          {/* Price */}
          <div className="text-xl font-bold text-green-600 mb-4 text-center">
            {formatPrice(product.sale_price)}
          </div>
        </div>
      </CardBody>

      <CardFooter className="p-4 pt-0">
        <Tooltip
          content="Stock agotado en carrito"
          isDisabled={product.current_stock > 0 && getRemainingStock() > 0}
          placement="bottom"
        >
          <Button
            onPress={() => onAddToCart(product)}
            isDisabled={!canAddToCart}
            fullWidth
            size="lg"
            radius="full"
            variant="shadow"
            color={canAddToCart ? 'success' : 'default'}
            className={`font-semibold ${canAddToCart ? 'hover:opacity-90' : ''}`}
            startContent={<PlusCircleIcon />}
          >
            {product.current_stock <= 0 ? 'SIN STOCK' : 'AGREGAR'}
          </Button>
        </Tooltip>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
