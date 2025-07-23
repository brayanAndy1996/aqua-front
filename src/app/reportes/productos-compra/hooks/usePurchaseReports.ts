import { useMemo } from 'react';
import useSWR from 'swr';
import { reportApi } from '@/apis/report.api';
import { filtersReportToVentas, dataReportCompras } from '@/types/report';
import { colorsToGraphDoughnut } from '@/lib/constants/colors';
import { formDataDaily, formDataMonthly } from '@/lib/utils/reports';
import { salesAgrupTo } from '@/lib/utils/reports';

const formData = (data: dataReportCompras) => {
  const purchaseAgroupData = salesAgrupTo(data.purchases);
  const timeSeriesData = formDataDaily(data.purchases);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const productPurchaseData = purchaseAgroupData.map((purchase: any, index: number) => ({
      label: purchase.product_name || '',
      value: Number(purchase.quantity) || 0,
      color: colorsToGraphDoughnut[index]
    }));
  const monthlyPurchaseData = formDataMonthly(data.purchases);

  // Calcular métricas basadas en los datos reales
  const totalCost = data.purchases.reduce((sum, purchase) => sum + (purchase.purchase_price * purchase.quantity), 0);
  const averagePurchaseValue = data.purchases.length > 0 ? totalCost / data.purchases.length : 0;

  return {
    purchaseData: data.purchases || [],
    metricsData: {
      totalPurchases: data.totalPurchases || 0,
      totalCost: totalCost,
      averagePurchaseValue: averagePurchaseValue,
      topPurchasedProduct: data.topPurchaseProduct,
      costReduction: 0 
    },
    chartData: {
      timeSeriesData,
      productPurchaseData,
      monthlyPurchaseData
    }
  };
};

export default function usePurchaseReports(filters: filtersReportToVentas) {

  // Crear clave única para SWR basada en filtros
  const key = useMemo(() => {
    
    return [
      'purchase-reports',
      {...filters}
    ];
  }, [filters]);

  // Usar SWR para obtener datos usando la API real
  const { data, error, isLoading, mutate } = useSWR(
    key,
    async ([ , filters]: [string, filtersReportToVentas]) => {
      
      // Llamada real a la API de compras
      const response = await reportApi.getReportComprasByFilters(filters as unknown as { [key: string]: string | number | boolean });
      return formData(response.data);
    },
    {
      revalidateOnFocus: false,
      revalidateOnMount: true,
      dedupingInterval: 30000, // 30 segundos
      keepPreviousData: true,
    }
  );

  return {
    purchaseData: data?.purchaseData || [],
    metricsData: data?.metricsData || {
      totalPurchases: 0,
      totalCost: 0,
      averagePurchaseValue: 0,
      topPurchasedProduct: '',
      costReduction: 0
    },
    chartData: data?.chartData || {
      timeSeriesData: [],
      productPurchaseData: [],
      monthlyPurchaseData: []
    },
    loading: isLoading,
    error,
    refresh: mutate
  };
}
