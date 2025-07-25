"use client";

import { motion } from 'framer-motion';
import { Card, CardBody, Skeleton } from '@heroui/react';
import { 
  CurrencyDollarIcon, 
  ShoppingCartIcon, 
  ChartBarIcon,
  ArrowTrendingUpIcon 
} from '@heroicons/react/24/outline';

interface SalesMetricsProps {
  data: {
    totalSales: number;
    totalRevenue: number;
    averageOrderValue: number;
    topSellingProduct: string;
    salesGrowth: number;
  };
  loading: boolean;
}

export default function SalesMetrics({ data, loading }: SalesMetricsProps) {
  const metrics = [
    {
      title: 'Total de Ventas',
      value: data.totalSales?.toLocaleString(),
      icon: ShoppingCartIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      suffix: 'ventas'
    },
    {
      title: 'Ingresos Totales',
      value: `$${data.totalRevenue?.toLocaleString('es-CO')}`,
      icon: CurrencyDollarIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      suffix: 'COP'
    },
    {
      title: 'Valor Promedio por Venta',
      value: `$${data.averageOrderValue?.toLocaleString('es-CO')}`,
      icon: ChartBarIcon,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      suffix: 'COP'
    },
    {
      title: 'Crecimiento',
      value: `${data.salesGrowth > 0 ? '+' : ''}${data.salesGrowth?.toFixed(1)}%`,
      icon: ArrowTrendingUpIcon,
      color: data.salesGrowth >= 0 ? 'text-green-600' : 'text-red-600',
      bgColor: data.salesGrowth >= 0 ? 'bg-green-100' : 'bg-red-100',
      suffix: 'vs período anterior'
    },
    {
      title: 'Producto Más Vendido',
      value: `${data.topSellingProduct}`,
      icon: ChartBarIcon,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="bg-white/70 backdrop-blur-md border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 lg:h-[150px]">
              <CardBody className="p-6">
                {loading ? (
                  <div className="space-y-3">
                    <Skeleton className="h-4 w-3/4 rounded-lg" />
                    <Skeleton className="h-8 w-1/2 rounded-lg" />
                    <Skeleton className="h-3 w-full rounded-lg" />
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-around mb-4">
                      <div className={`rounded-full ${metric.bgColor}`}>
                        <metric.icon className={`w-6 h-6 ${metric.color}`} />
                      </div>
                      <h3 className="text-sm font-medium text-gray-600">
                        {metric.title}
                      </h3>
                    </div>
                    
                    <div className="space-y-2">
                      <p className={`text-xl font-bold text-center ${metric.color}`}>
                        {metric.value}
                      </p>
                      <p className="text-xs text-center text-gray-500">
                        {metric.suffix || ''}
                      </p>
                    </div>
                  </>
                )}
              </CardBody>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
