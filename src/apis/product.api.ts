import axios from 'axios';
import { Product, ResponseProduct, ResponseProductById } from '@/types/product';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const productApi = {
    getProducts: async (accessToken: string): Promise<ResponseProduct> => {
        const response = await axios.get(`${API_URL}/productos/traer-productos`, {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        return response.data;
    },
    getProductsByPagination: async (accessToken: string, page: number, limit: number, filters: { [key: string]: string | number | boolean } = {}): Promise<ResponseProduct> => {
        const response = await axios.get(`${API_URL}/productos/traer-productos-con-paginacion`, {
            headers: { Authorization: `Bearer ${accessToken}` },
            params: {
                page,
                limit,
                ...filters
            }
        });
        return response.data;
    },
    
    getProductById: async (accessToken: string, productId: number): Promise<ResponseProductById> => {
        const response = await axios.get(`${API_URL}/productos/traer-producto/${productId}`, {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        return response.data;
    },

    createProduct: async (accessToken: string, product: Product): Promise<ResponseProductById> => {
        const response = await axios.post(`${API_URL}/productos/crear-producto`, product, {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        return response.data;
    },

    updateProduct: async (accessToken: string, productId: number, product: Product): Promise<ResponseProductById> => {
        const response = await axios.put(`${API_URL}/productos/actualizar-producto/${productId}`, product, {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        return response.data;
    },
    deleteProduct: async (accessToken: string, productId: number): Promise<ResponseProductById> => {
        const response = await axios.delete(`${API_URL}/productos/eliminar-producto/${productId}`, {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        return response.data;
    }
}