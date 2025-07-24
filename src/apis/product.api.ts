import { Product, ResponseProduct, ResponseProductById } from '@/types/product';
import { apiGet, apiPost, apiPut, apiDelete, buildUrl } from '@/lib/api/apiWrapper';

export const productApi = {
    getProducts: async (filters: { [key: string]: string | number | boolean } = {}): Promise<ResponseProduct> => {
        const url = buildUrl('/productos/traer-productos', filters);
        return await apiGet<ResponseProduct>(url);
    },
    
    getProductsByPagination: async (page: number, limit: number, filters: { [key: string]: string | number | boolean } = {}): Promise<ResponseProduct> => {
        const url = buildUrl('/productos/traer-productos-con-paginacion', {
            page,
            limit,
            ...filters
        });
        return await apiGet<ResponseProduct>(url);
    },
    
    getProductById: async (productId: number): Promise<ResponseProductById> => {
        return await apiGet<ResponseProductById>(`/productos/traer-producto/${productId}`);
    },
    
    createProduct: async (productData: Omit<Product, 'id'>): Promise<ResponseProductById> => {
        return await apiPost<ResponseProductById, Omit<Product, 'id'>>('/productos/crear-producto', productData);
    },
    
    updateProduct: async (productId: number, productData: Partial<Product>): Promise<ResponseProductById> => {
        return await apiPut<ResponseProductById, Partial<Product>>(`/productos/actualizar-producto/${productId}`, productData);
    },
    
    deleteProduct: async (productId: number): Promise<ResponseProductById> => {
        return await apiDelete<ResponseProductById>(`/productos/eliminar-producto/${productId}`);
    }
}