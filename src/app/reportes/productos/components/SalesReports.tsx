"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import ReportFilters from './ReportFilters';
import SalesCharts from './SalesCharts';
import SalesMetrics from './SalesMetrics';
import useSalesReports from '../hooks/useSalesReports';

export default function SalesReports() {
  const [filters, setFilters] = useState({
    userId: '',
    productName: '',
    productCode: '',
    startDate: '',
    endDate: '',
    singleDate: ''
  });

  const { 
    salesData, 
    metricsData, 
    chartData, 
    loading
  } = useSalesReports(filters);
    console.log("🚀 ~ SalesReports ~ salesData:", salesData)

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
          type="sales"
        />

        {/* Métricas principales */}
        <SalesMetrics 
          data={metricsData}
          loading={loading}
        />

        {/* Gráficos */}
        <SalesCharts 
          data={chartData}
          loading={loading}
        />
      </motion.div>
    </div>
  );
}
