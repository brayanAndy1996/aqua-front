'use client';

import { motion } from 'framer-motion';
import PurchaseReports from './components/PurchaseReports';
import glassStyles from '@/app/styles/glassStyles.module.css';

export default function ProductosCompraPage() {

  return (
    <div className="w-full h-full flex flex-col">
      <div className="w-full h-full bg-white/60 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden">
        <div className={`${glassStyles.glassHeader} p-6`}>
          <motion.h1 
            className="text-3xl font-bold text-gray-800 mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Reportes de Compras
          </motion.h1>
        </div>
        
        <div className="flex-1 overflow-hidden">
          <PurchaseReports />
        </div>
      </div>
    </div>
  );
}