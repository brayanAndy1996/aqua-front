
import { useMemo } from 'react';
import { userApi } from '@/apis/user.api';
import { productApi } from '@/apis/product.api';
import useSWR from 'swr';
import { useSession } from 'next-auth/react';

export default function useReportFilters(filters: { productCode: string, productName: string }) {
    const { data: session, status } = useSession();
    const keyUsers = useMemo(() => {
        if (status !== 'authenticated' || !session?.user?.accessToken) return null;
        
        return [
          'users',
          session.user.accessToken,
        ];
      }, [status, session]);
      
      const { data: users, error: usersError, isLoading: usersLoading } = useSWR(
        keyUsers,
        async ([ , accessToken]: [string, string]) => {
          const response = await userApi.getUsers(accessToken);
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
        if (status !== 'authenticated' || !session?.user?.accessToken) return null;
        
        return [
          'products',
          session.user.accessToken,
          filters.productCode,
          filters.productName
        ];
      }, [status, session, filters]);
      
      const { data: products, error: productsError, isLoading: productsLoading } = useSWR(
        keyProducts,
        async ([ , accessToken, productCode, productName]: [string, string, string, string]) => {
          const response = await productApi.getProducts(accessToken, { code: productCode, name: productName });
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