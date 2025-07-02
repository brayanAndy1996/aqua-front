"use client";

import { motion } from 'framer-motion';
import { Card, CardBody, CardHeader, Skeleton } from '@heroui/react';
import TimeSeriesChart from '@/components/charts/TimeSeriesChart';

interface PurchaseChartsProps {
  data: {
    timeSeriesData: Array<{ time: string; value: number }>;
    productPurchaseData: Array<{ label: string; value: number; color?: string }>;
    monthlyPurchaseData: Array<{ time: string; value: number }>;
  };
  loading: boolean;
}

export default function PurchaseCharts({ data, loading }: PurchaseChartsProps) {

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="col-span-2"
      >
        <Card>
          <CardHeader>
            <h3 className="text-lg font-medium">Compras diarias</h3>
          </CardHeader>
          <CardBody>
            {loading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : (
              <TimeSeriesChart 
                data={data.timeSeriesData}
                type="area"
                colors={{
                  lineColor: '#f59e0b',
                  topColor: 'rgba(245, 158, 11, 0.4)',
                  bottomColor: 'rgba(245, 158, 11, 0.0)',
                }}
                lineWidth={2}
                className="h-[300px] w-full"
              />
            )}
          </CardBody>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <h3 className="text-lg font-medium">Productos más comprados</h3>
          </CardHeader>
          <CardBody>
            {loading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : (
              <div className="flex justify-center items-center h-[300px]">
                <div className="text-center">
                  <div className="text-2xl font-bold text-amber-500">
                    {data.productPurchaseData.reduce((sum, item) => sum + item.value, 0).toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-500">Total compras por producto</div>
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
            <h3 className="text-lg font-medium">Compras mensuales</h3>
          </CardHeader>
          <CardBody>
            {loading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : (
              <TimeSeriesChart 
                data={data.monthlyPurchaseData}
                type="line"
                colors={{
                  color: '#ef4444'
                }}
                lineWidth={3}
                className="h-[300px] w-full"
              />
            )}
          </CardBody>
        </Card>
      </motion.div>
    </div>
  );
}
