
import { useMemo } from 'react';
import { userApi } from '@/apis/user.api';
import { productApi } from '@/apis/product.api';
import useSWR from 'swr';

export default function useReportFilters(filters: { productCode: string, productName: string }) {
    const keyUsers = useMemo(() => {
        
        return [
          'users'
        ];
      }, []);
      
      const { data: users, error: usersError, isLoading: usersLoading } = useSWR(
        keyUsers,
        async () => {
          const response = await userApi.getUsers();
          return response.data;
        },
        {
          revalidateOnFocus: false,
          revalidateOnMount: true,
          dedupingInterval: 30000, // 30 segundos
          keepPreviousData: true,
        }
      );
    
      const keyProducts = useMemo(() => {
        
        return [
          'products',
          filters.productCode,
          filters.productName
        ];
      }, [filters]);
      
      const { data: products, error: productsError, isLoading: productsLoading } = useSWR(
        keyProducts,
        async ([ , productCode, productName]: [string, string, string]) => {
          const response = await productApi.getProducts( { code: productCode, name: productName });
          return response.data;
        },
        {
          revalidateOnFocus: false,
          revalidateOnMount: true,
          dedupingInterval: 30000, // 30 segundos
          keepPreviousData: true,
        }
      );
    return {
        users: users || [],
        usersError,
        usersLoading,
        products,
        productsError,
        productsLoading
    }
}