import { useMemo } from 'react';
import useSWR from 'swr';
import { reportApi } from '@/apis/report.api';
import { dataReportVentas } from '@/types/report';
import { colorsToGraphDoughnut } from '@/lib/constants/colors';
import { formDataDaily, formDataMonthly, salesAgrupTo } from '@/lib/utils/reports';
import { formDataReportVentas } from '@/types/report';

const formData = (data: dataReportVentas): formDataReportVentas => {
  
  const salesAgrupToProductData = salesAgrupTo(data.sales);
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const productSalesData = salesAgrupToProductData.map((sale: any, index: number) => ({
    label: sale.product_name || '',
    value: Number(sale.quantity) || 0,
    color: colorsToGraphDoughnut[index]
  }));

  const timeSeriesData = formDataDaily(data.sales);
  const monthlySalesData = formDataMonthly(data.sales);

  return {
    salesData: data.sales,
    metricsData: {
      totalSales: data.totalSales,
      totalRevenue: data.totalRevenue,
      averageOrderValue: data.averageOrderValue,
      topSellingProduct: data.topSellingProduct,
      salesGrowth: data.salesGrowth
    },
    chartData: {
      timeSeriesData,
      productSalesData,
      monthlySalesData
    }
  };
};

export default function useSalesReports(filters: { [key: string]: string | number | boolean | null }) {

  // Crear clave única para SWR basada en filtros
  const key = useMemo(() => {
    
    return [
      'sales-reports',
      {...filters}
    ];
  }, [filters]);

  // Usar SWR para obtener datos (por ahora mock data)
  const { data, error, isLoading, mutate } = useSWR(
    key,
    async ([ , filters]: [string, { [key: string]: string | number | boolean }]) => {
      
      // TODO: Reemplazar con llamada real a la API
      const response = await reportApi.getReportVentasByFilters(filters);
      return formData(response.data)
    },
    {
      revalidateOnFocus: false,
      revalidateOnMount: true,
      dedupingInterval: 30000, // 30 segundos
      keepPreviousData: true,
    }
  );

  return {
    salesData: data?.salesData || [],
    metricsData: data?.metricsData || {
      totalSales: 0,
      totalRevenue: 0,
      averageOrderValue: 0,
      topSellingProduct: '',
      salesGrowth: 0
    },
    chartData: data?.chartData || {
      timeSeriesData: [],
      productSalesData: [],
      monthlySalesData: []
    },
    loading: isLoading,
    error,
    refresh: mutate
  };
}
