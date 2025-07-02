"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import ReportFilters from './ReportFilters';
import PurchaseCharts from './PurchaseCharts';
import PurchaseMetrics from './PurchaseMetrics';
import usePurchaseReports from '../hooks/usePurchaseReports';

export default function PurchaseReports() {
  const [filters, setFilters] = useState({
    userId: '',
    productName: '',
    productCode: '',
    startDate: '',
    endDate: '',
    singleDate: ''
  });

  const { 
    purchaseData, 
    metricsData, 
    chartData, 
    loading, 
    error 
  } = usePurchaseReports(filters);

  const handleFiltersChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
  };

  return (
    <div className="p-6 h-full overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        {/* Filtros */}
        <ReportFilters 
          filters={filters}
          onFiltersChange={handleFiltersChange}
          type="purchases"
        />

        {/* Métricas principales */}
        <PurchaseMetrics 
          data={metricsData}
          loading={loading}
        />

        {/* Gráficos */}
        <PurchaseCharts 
          data={chartData}
          loading={loading}
        />
      </motion.div>
    </div>
  );
}
