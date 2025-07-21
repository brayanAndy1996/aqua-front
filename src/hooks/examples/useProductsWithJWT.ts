import { useState, useMemo, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import useSWR from 'swr';
import { productApi } from '@/apis/product.api';
import { Product } from '@/types/product';
import { handleSWRError } from '@/lib/utils/errors';
import { showSuccessToast } from '@/components/toastUtils';

interface UseProductsOptions {
  page?: number;
  limit?: number;
  filters?: Record<string, string | number | boolean>;
  enableAutoRefresh?: boolean;
}

/**
 * Hook personalizado para manejar productos con manejo automático de errores JWT
 * 
 * Este es un ejemplo de cómo implementar un hook que usa el nuevo sistema
 * de manejo de errores JWT de forma automática y transparente.
 */
export const useProductsWithJWT = (options: UseProductsOptions = {}) => {
  const { status } = useSession();
  const {
    page = 1,
    limit = 10,
    filters = {},
    enableAutoRefresh = false
  } = options;

  // Estados locales
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Crear clave única para SWR
  const swrKey = useMemo(() => {
    if (status !== 'authenticated') return null;
    
    return [
      'products-with-jwt',
      page,
      limit,
      JSON.stringify(filters)
    ];
  }, [status, page, limit, filters]);

  // Fetch de productos con SWR y manejo automático de errores
  const { 
    data: productsResponse, 
    error, 
    isLoading, 
    mutate,
    isValidating 
  } = useSWR(
    swrKey,
    async () => {
      // ✅ No necesitamos pasar token - el interceptor lo maneja automáticamente
      // ✅ Los errores JWT se manejan automáticamente
      const response = await productApi.getProductsByPagination(page, limit, filters);
      return response;
    },
    {
      revalidateOnFocus: false,
      revalidateOnMount: true,
      dedupingInterval: 5000,
      keepPreviousData: true,
      refreshInterval: enableAutoRefresh ? 30000 : 0, // Auto-refresh cada 30s si está habilitado
      onError: handleSWRError, // ✅ Manejo automático de errores incluyendo JWT
    }
  );

  // Extraer datos de la respuesta
  const products = productsResponse?.data || [];
  const totalCount = productsResponse?.count || 0;
  const totalPages = Math.ceil(totalCount / limit);

  // Función para crear producto
  const createProduct = useCallback(async (productData: Omit<Product, 'id'>) => {
    setIsCreating(true);
    try {
      // ✅ No necesitamos manejar errores JWT manualmente
      const newProduct = await productApi.createProduct(productData);
      
      showSuccessToast('Éxito', 'Producto creado correctamente');
      
      // Revalidar datos
      await mutate();
      
      return newProduct;
    } catch (error) {
      // ✅ Los errores ya se manejan automáticamente en el apiWrapper
      // Solo logueamos para debugging si es necesario
      console.error('Error creating product:', error);
      throw error; // Re-lanzar para que el componente pueda manejarlo si necesita lógica específica
    } finally {
      setIsCreating(false);
    }
  }, [mutate]);

  // Función para actualizar producto
  const updateProduct = useCallback(async (productId: number, productData: Partial<Product>) => {
    setIsUpdating(true);
    try {
      const updatedProduct = await productApi.updateProduct(productId, productData);
      
      showSuccessToast('Éxito', 'Producto actualizado correctamente');
      
      // Revalidar datos
      await mutate();
      
      return updatedProduct;
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    } finally {
      setIsUpdating(false);
    }
  }, [mutate]);

  // Función para eliminar producto
  const deleteProduct = useCallback(async (productId: number) => {
    setIsDeleting(true);
    try {
      await productApi.deleteProduct(productId);
      
      showSuccessToast('Éxito', 'Producto eliminado correctamente');
      
      // Revalidar datos
      await mutate();
      
      return true;
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    } finally {
      setIsDeleting(false);
    }
  }, [mutate]);

  // Función para refrescar datos manualmente
  const refresh = useCallback(() => {
    return mutate();
  }, [mutate]);

  // Función para obtener un producto específico
  const getProductById = useCallback(async (productId: number) => {
    try {
      return await productApi.getProductById(productId);
    } catch (error) {
      console.error('Error fetching product by ID:', error);
      throw error;
    }
  }, []);

  return {
    // Datos
    products,
    totalCount,
    totalPages,
    currentPage: page,
    
    // Estados de carga
    isLoading,
    isValidating,
    isCreating,
    isUpdating,
    isDeleting,
    
    // Estados de error (SWR maneja automáticamente los errores JWT)
    error,
    
    // Funciones de mutación
    createProduct,
    updateProduct,
    deleteProduct,
    getProductById,
    
    // Utilidades
    refresh,
    mutate, // Acceso directo a mutate de SWR para casos avanzados
    
    // Información de paginación
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  };
};

// Ejemplo de uso en un componente:
/*
const ProductsComponent = () => {
  const {
    products,
    isLoading,
    createProduct,
    updateProduct,
    deleteProduct,
    totalCount,
    hasNextPage
  } = useProductsWithJWT({
    page: 1,
    limit: 10,
    filters: { active: true },
    enableAutoRefresh: true
  });

  const handleCreate = async () => {
    try {
      await createProduct({
        name: 'Nuevo Producto',
        price: 100,
        description: 'Descripción del producto'
      });
      // ✅ El éxito se maneja automáticamente con toast
    } catch (error) {
      // ✅ Los errores JWT se manejan automáticamente
      // Solo manejar lógica específica del componente aquí
      console.log('Manejar lógica específica si es necesario');
    }
  };

  if (isLoading) return <div>Cargando...</div>;

  return (
    <div>
      <h1>Productos ({totalCount})</h1>
      {products.map(product => (
        <div key={product.id}>{product.name}</div>
      ))}
      <button onClick={handleCreate}>Crear Producto</button>
    </div>
  );
};
*/

export default useProductsWithJWT;
