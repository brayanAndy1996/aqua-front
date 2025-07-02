import { useMemo } from 'react';
import useSWR from 'swr';
import { useSession } from 'next-auth/react';

interface PurchaseFilters {
  userId: string;
  productName: string;
  productCode: string;
  startDate: string;
  endDate: string;
  singleDate: string;
}

// Mock data para desarrollo
const generateMockPurchaseData = () => {
  const today = new Date();
  const timeSeriesData = [];
  const productPurchaseData = [
    { label: 'Equipos de Filtración', value: 38, color: '#f59e0b' },
    { label: 'Productos Químicos', value: 35, color: '#ef4444' },
    { label: 'Accesorios de Piscina', value: 22, color: '#f97316' },
    { label: 'Equipos de Limpieza', value: 18, color: '#dc2626' },
    { label: 'Repuestos', value: 15, color: '#ea580c' },
  ];
  
  // Generar datos de serie temporal para los últimos 30 días
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    timeSeriesData.push({
      time: date.toISOString().split('T')[0],
      value: Math.floor(Math.random() * 30000) + 5000
    });
  }

  // Generar datos mensuales para los últimos 12 meses
  const monthlyPurchaseData = [];
  for (let i = 11; i >= 0; i--) {
    const date = new Date(today);
    date.setMonth(date.getMonth() - i);
    monthlyPurchaseData.push({
      time: date.toISOString().split('T')[0].substring(0, 7), // YYYY-MM format
      value: Math.floor(Math.random() * 300000) + 50000
    });
  }

  return {
    purchaseData: [],
    metricsData: {
      totalPurchases: 892,
      totalCost: 8950000,
      averagePurchaseValue: 10034,
      topPurchasedProduct: 'Sistema de Filtración Avanzado',
      costReduction: -5.2
    },
    chartData: {
      timeSeriesData,
      productPurchaseData,
      monthlyPurchaseData
    }
  };
};

export default function usePurchaseReports(filters: PurchaseFilters) {
  const { data: session, status } = useSession();

  // Crear clave única para SWR basada en filtros
  const key = useMemo(() => {
    if (status !== 'authenticated' || !session?.user?.accessToken) return null;
    
    return [
      'purchase-reports',
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
      // const response = await purchaseApi.getPurchaseReports(session.user.accessToken, filters);
      // return response.data;
      
      return generateMockPurchaseData();
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
