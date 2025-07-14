"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tabs, Tab } from '@heroui/react';
import { TableCellsIcon as TableIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import { filtersReportToVentas } from '@/types/report';
import ReportFilters from '../../productos/components/ReportFilters';
import PurchaseCharts from './PurchaseCharts';
import PurchaseMetrics from './PurchaseMetrics';
import PurchaseDataTable from './PurchaseDataTable';
import usePurchaseReports from '../hooks/usePurchaseReports';
import dayjs from 'dayjs';

export default function PurchaseReports() {
  // Estado para las tabs
  const [selectedTab, setSelectedTab] = useState("reportes");
  
  const [filters, setFilters] = useState<filtersReportToVentas>({
    productId: null,
    startDate: dayjs().startOf('month').format('YYYY-MM-DD'),
    endDate: dayjs().format('YYYY-MM-DD'),
    userId: null,
  });

  const { 
    purchaseData, 
    metricsData, 
    chartData, 
    loading
  } = usePurchaseReports(filters);

  const handleFiltersChange = (newFilters: filtersReportToVentas) => {
    setFilters(newFilters);
  };

  // Variantes de animación para las tabs
  const tabContentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
  };

  return (
    <div className="p-6 h-full overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        {/* Tabs de navegación */}
        <Tabs 
          aria-label="Opciones de reportes"
          selectedKey={selectedTab}
          onSelectionChange={(key: string | number) => setSelectedTab(key.toString())}
          variant="bordered"
        >
          <Tab 
            key="reportes" 
            title={
              <div className="flex items-center space-x-2">
                <TableIcon className="h-5 w-5" />
                <span>Reportes</span>
              </div>
            }
          />
          <Tab 
            key="estadisticas" 
            title={
              <div className="flex items-center space-x-2">
                <ChartBarIcon className="h-5 w-5" />
                <span>Estadísticas</span>
              </div>
            }
          />
        </Tabs>

        {/* Filtros (siempre visibles) */}
        <ReportFilters 
          filters={filters}
          onFiltersChange={handleFiltersChange}
          type="purchases"
        />
        
        {/* Contenido según la tab seleccionada */}
        <AnimatePresence mode="wait">
          {selectedTab === "reportes" ? (
            <motion.div
              key="reportes-content"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={tabContentVariants}
            >
              {/* Tabla de datos */}
              <PurchaseDataTable 
                purchaseData={purchaseData}
                loading={loading}
                title="Detalle de Compras"
              />
            </motion.div>
          ) : (
            <motion.div
              key="estadisticas-content"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={tabContentVariants}
              className="space-y-6"
            >
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
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
