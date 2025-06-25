"use client";

import ProductList from './components/ProductList';
import glassStyles from '@/app/styles/glassStyles.module.css';

export default function ProductsListaPage() {
  return (
    <div 
      className="w-full h-full flex flex-col" 
    >
      <div className="w-full h-full bg-white/60 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden">
        <div className={`${glassStyles.glassHeader} p-6`}>
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Gestión de Productos</h1>
        </div>
        <ProductList />
      </div>
    </div>
  );
}