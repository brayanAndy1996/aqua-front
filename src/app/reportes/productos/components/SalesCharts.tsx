"use client";

import { motion } from 'framer-motion';
import { Card, CardBody, CardHeader, Skeleton } from '@heroui/react';
import TimeSeriesChart from '@/components/charts/TimeSeriesChart';

interface SalesChartsProps {
  data: {
    timeSeriesData: Array<{ time: string; value: number }>;
    productSalesData: Array<{ label: string; value: number; color?: string }>;
    monthlySalesData: Array<{ time: string; value: number }>;
  };
  loading: boolean;
}

export default function SalesCharts({ data, loading }: SalesChartsProps) {
console.log("🚀 ~ SalesCharts ~ data:", data)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Gráfico de ventas diarias */}
        <Card className="w-full">
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-800">Ventas Diarias</h3>
          </CardHeader>
          <CardBody>
            {loading ? (
              <Skeleton className="h-[300px] w-full rounded-lg" />
            ) : (
              <TimeSeriesChart 
                data={data.timeSeriesData}
                type="area"
                colors={{
                  lineColor: '#3b82f6',
                  topColor: 'rgba(59, 130, 246, 0.4)',
                  bottomColor: 'rgba(59, 130, 246, 0.0)',
                }}
                lineWidth={2}
                className="h-[300px] w-full"
              />
            )}
          </CardBody>
        </Card>

        {/* Gráfico de ventas mensuales */}
        <Card className="w-full">
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-800">Ventas Mensuales</h3>
          </CardHeader>
          <CardBody>
            {loading ? (
              <Skeleton className="h-[300px] w-full rounded-lg" />
            ) : (
              <TimeSeriesChart 
                data={data.monthlySalesData}
                type="line"
                colors={{
                  color: '#10b981'
                }}
                lineWidth={3}
                className="h-[300px] w-full"
              />
            )}
          </CardBody>
        </Card>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <h3 className="text-lg font-medium">Productos más vendidos</h3>
            </CardHeader>
            <CardBody>
              {loading ? (
                <Skeleton className="h-[300px] w-full" />
              ) : (
                <div className="flex justify-center items-center h-[300px]">
                  {/* Placeholder for DoughnutChart - actual implementation depends on the component's props */}
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-500">
                      {data.productSalesData.reduce((sum, item) => sum + item.value, 0).toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-500">Total ventas por producto</div>
                  </div>
                </div>
              )}
            </CardBody>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <h3 className="text-lg font-medium">Distribución de ventas</h3>
            </CardHeader>
            <CardBody>
              {loading ? (
                <Skeleton className="h-[300px] w-full" />
              ) : (
                <div className="flex justify-center items-center h-[300px]">
                  {/* Aquí podría ir un gráfico adicional o estadísticas */}
                  <div className="text-center">
                    <div className="text-2xl font-bold text-indigo-500">
                      {data.timeSeriesData.reduce((sum, item) => sum + item.value, 0).toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-500">Total ventas acumuladas</div>
                  </div>
                </div>
              )}
            </CardBody>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
