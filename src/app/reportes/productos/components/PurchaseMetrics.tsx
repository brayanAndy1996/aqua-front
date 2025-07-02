"use client";

import { motion } from 'framer-motion';
import { Card, CardBody, Skeleton } from '@heroui/react';
import { 
  CurrencyDollarIcon, 
  ShoppingBagIcon, 
  ChartBarIcon,
  ArrowTrendingDownIcon 
} from '@heroicons/react/24/outline';

interface PurchaseMetricsProps {
  data: {
    totalPurchases: number;
    totalCost: number;
    averagePurchaseValue: number;
    topPurchasedProduct: string;
    costReduction: number;
  };
  loading: boolean;
}

export default function PurchaseMetrics({ data, loading }: PurchaseMetricsProps) {
  const metrics = [
    {
      title: 'Total de Compras',
      value: data.totalPurchases.toLocaleString(),
      icon: ShoppingBagIcon,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      suffix: 'compras'
    },
    {
      title: 'Costo Total',
      value: `$${data.totalCost.toLocaleString('es-CO')}`,
      icon: CurrencyDollarIcon,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
      suffix: 'COP'
    },
    {
      title: 'Valor Promedio por Compra',
      value: `$${data.averagePurchaseValue.toLocaleString('es-CO')}`,
      icon: ChartBarIcon,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100',
      suffix: 'COP'
    },
    {
      title: 'Reducción de Costos',
      value: `${data.costReduction > 0 ? '+' : ''}${data.costReduction.toFixed(1)}%`,
      icon: ArrowTrendingDownIcon,
      color: data.costReduction >= 0 ? 'text-green-600' : 'text-red-600',
      bgColor: data.costReduction >= 0 ? 'bg-green-100' : 'bg-red-100',
      suffix: 'vs período anterior'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="bg-white/70 backdrop-blur-md border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardBody className="p-6">
                {loading ? (
                  <div className="space-y-3">
                    <Skeleton className="h-4 w-3/4 rounded-lg" />
                    <Skeleton className="h-8 w-1/2 rounded-lg" />
                    <Skeleton className="h-3 w-full rounded-lg" />
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-full ${metric.bgColor}`}>
                        <metric.icon className={`w-6 h-6 ${metric.color}`} />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium text-gray-600">
                        {metric.title}
                      </h3>
                      <p className={`text-2xl font-bold ${metric.color}`}>
                        {metric.value}
                      </p>
                      <p className="text-xs text-gray-500">
                        {metric.suffix}
                      </p>
                    </div>
                  </>
                )}
              </CardBody>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Producto más comprado */}
      {!loading && data.topPurchasedProduct && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-6"
        >
          <Card className="bg-gradient-to-r from-orange-500/10 to-red-500/10 backdrop-blur-md border-0 shadow-lg">
            <CardBody className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-orange-100 rounded-full">
                  <ChartBarIcon className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Producto Más Comprado
                  </h3>
                  <p className="text-orange-600 font-medium">
                    {data.topPurchasedProduct}
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
}
