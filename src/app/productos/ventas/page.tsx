'use client';

import React from 'react';
import { useProducts } from '@/app/productos/ventas/hooks/useProducts';
import ProductGrid from '@/app/productos/ventas/components/ProductGrid';
import CartSummary from '@/app/productos/ventas/components/CartSummary';
import styles from '@/app/styles/glassStyles.module.css';

const VentasPage = () => {
  const {
    products,
    loading,
    error,
    cart,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    getTotalPrice,
    getTotalItems,
    getSubtotal,
    getIGV,
    refetch,
    handleComprar,
    session
  } = useProducts();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className={`${styles.glassHeader} mb-8`}>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                🏊‍♂️ Ventas - Aqua Control
              </h1>
              <p className="text-gray-600">
                Productos para escuela de natación
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">
                Productos disponibles: {products.length}
              </div>
              {getTotalItems() > 0 && (
                <div className="text-lg font-semibold text-green-600">
                  Carrito: {getTotalItems()} {getTotalItems() === 1 ? 'artículo' : 'artículos'}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Products Grid */}
          <div className="lg:col-span-3">
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  Productos Disponibles
                </h2>
                <button
                  onClick={() => refetch()}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full text-sm transition-colors flex items-center gap-2"
                >
                  <span>🔄</span>
                  Actualizar
                </button>
              </div>
            </div>
            
            <ProductGrid
              products={products}
              loading={loading}
              error={error}
              onAddToCart={addToCart}
              cart={cart}
            />
          </div>

          {/* Cart Summary */}
          <div className="lg:col-span-1">
            <CartSummary
              cart={cart}
              totalPrice={getTotalPrice()}
              onUpdateQuantity={updateCartQuantity}
              onRemoveItem={removeFromCart}
              onClearCart={clearCart}
              onCheckout={handleComprar}
              getSubtotal={getSubtotal}
              getIGV={getIGV}
              refetch={refetch}
              idUser={session?.user?.id || 0}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-gray-500 text-sm">
          <p>Sistema de Ventas - Aqua Control 2024</p>
        </div>
      </div>
    </div>
  );
};

export default VentasPage;