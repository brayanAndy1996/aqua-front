import { useMemo } from 'react';
import useSWR from 'swr';
import { useSession } from 'next-auth/react';

interface SalesFilters {
  userId: string;
  productName: string;
  productCode: string;
  startDate: string;
  endDate: string;
  singleDate: string;
}

// Mock data para desarrollo
const generateMockSalesData = () => {
  const today = new Date();
  const timeSeriesData = [];
  const productSalesData = [
    { label: 'Clases de Natación', value: 45, color: '#3b82f6' },
    { label: 'Equipos de Natación', value: 32, color: '#10b981' },
    { label: 'Accesorios', value: 28, color: '#f59e0b' },
    { label: 'Mantenimiento', value: 15, color: '#ef4444' },
    { label: 'Productos Químicos', value: 12, color: '#8b5cf6' },
  ];
  
  // Generar datos de serie temporal para los últimos 30 días
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    timeSeriesData.push({
      time: date.toISOString().split('T')[0],
      value: Math.floor(Math.random() * 50000) + 10000
    });
  }

  // Generar datos mensuales para los últimos 12 meses
  const monthlySalesData = [];
  for (let i = 11; i >= 0; i--) {
    const date = new Date(today);
    date.setMonth(date.getMonth() - i);
    monthlySalesData.push({
      time: date.toISOString().split('T')[0].substring(0, 7), // YYYY-MM format
      value: Math.floor(Math.random() * 500000) + 100000
    });
  }

  return {
    salesData: [],
    metricsData: {
      totalSales: 1247,
      totalRevenue: 15750000,
      averageOrderValue: 12630,
      topSellingProduct: 'Clases de Natación Adultos',
      salesGrowth: 12.5
    },
    chartData: {
      timeSeriesData,
      productSalesData,
      monthlySalesData
    }
  };
};

export default function useSalesReports(filters: SalesFilters) {
  const { data: session, status } = useSession();

  // Crear clave única para SWR basada en filtros
  const key = useMemo(() => {
    if (status !== 'authenticated' || !session?.user?.accessToken) return null;
    
    return [
      'sales-reports',
      session.user.accessToken,
      filters.userId,
      filters.productName,
      filters.productCode,
      filters.startDate,
      filters.endDate,
      filters.singleDate
    ];
  }, [status, session, filters]);

  // Usar SWR para obtener datos (por ahora mock data)
  const { data, error, isLoading, mutate } = useSWR(
    key,
    async () => {
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // TODO: Reemplazar con llamada real a la API
      // const response = await salesApi.getSalesReports(session.user.accessToken, filters);
      // return response.data;
      
      return generateMockSalesData();
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
