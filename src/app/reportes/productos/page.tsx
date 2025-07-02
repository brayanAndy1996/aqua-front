'use client';

import { useState } from 'react';
import { Tabs, Tab } from '@heroui/react';
import { motion } from 'framer-motion';
import SalesReports from './components/SalesReports';
import PurchaseReports from './components/PurchaseReports';
import glassStyles from '@/app/styles/glassStyles.module.css';

export default function ProductosPage() {
  const [selectedTab, setSelectedTab] = useState('sales');

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
            Reportes de Productos
          </motion.h1>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Tabs 
              selectedKey={selectedTab}
              onSelectionChange={(key) => setSelectedTab(key as string)}
              variant="underlined"
              classNames={{
                tabList: "gap-6 w-full relative rounded-none p-0 border-b border-divider",
                cursor: "w-full bg-blue-500",
                tab: "max-w-fit px-0 h-12",
                tabContent: "group-data-[selected=true]:text-blue-600 font-semibold text-lg"
              }}
            >
              <Tab key="sales" title="Reportes de Ventas" />
              <Tab key="purchases" title="Reportes de Compras" />
            </Tabs>
          </motion.div>
        </div>
        
        <div className="flex-1 overflow-hidden">
          <motion.div
            key={selectedTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            {selectedTab === 'sales' ? <SalesReports /> : <PurchaseReports />}
          </motion.div>
        </div>
      </div>
    </div>
  );
}