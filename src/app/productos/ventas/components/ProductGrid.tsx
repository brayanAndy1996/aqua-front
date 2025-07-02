import React from 'react';
import ProductCard from './ProductCard';
import { ProductGridProps } from '@/types/product';

const ProductGrid: React.FC<ProductGridProps> = ({ 
  products, 
  loading, 
  error, 
  onAddToCart,
  cart 
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {[...Array(8)].map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="bg-white/30 backdrop-blur-md rounded-3xl h-80 border border-white/20"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 text-lg mb-4">⚠️ {error}</div>
        <button 
          onClick={() => window.location.reload()}
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-full transition-colors"
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🏊‍♂️</div>
        <div className="text-gray-600 text-lg">No hay productos disponibles</div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={onAddToCart}
          cart={cart}
        />
      ))}
    </div>
  );
};

export default ProductGrid;
