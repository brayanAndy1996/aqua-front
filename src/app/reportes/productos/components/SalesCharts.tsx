"use client";

import { motion } from 'framer-motion';
import { Card, CardBody, CardHeader, Skeleton } from '@heroui/react';
import TimeSeriesChart from '@/components/charts/TimeSeriesChart';
import PieChart from '@/components/charts/PieChart';

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
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Gráfico de ventas diarias */}
        <Card className="w-full col-span-3">
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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="w-full col-span-2"
        >
          <Card>
            <CardHeader>
              <h3 className="text-lg font-medium">Productos más vendidos</h3>
            </CardHeader>
            <CardBody>
              {loading ? (
                <Skeleton className="h-[300px] w-full" />
              ) : (
                <div className="flex justify-center items-center h-[300px] relative">
                  <div className="text-center w-full">
                    <PieChart 
                      data={data.productSalesData}
                      cutout="50%"
                      legendPosition="right"
                      // height={300}
                      // width={500}
                      title="Productos más vendidos"
                      hoverOffset={15}
                    />
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
