import axios from 'axios';
import { User, ResponseUser, ResponseUserById } from '@/types/user';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const userApi = {
    getUsers: async (accessToken: string): Promise<ResponseUser> => {
        const response = await axios.get(`${API_URL}/users/traer-usuarios`, {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        return response.data;
    },

    getUsersWithPagination: async (accessToken: string, page: number, limit: number, filters: { [key: string]: string | number | boolean } = {}): Promise<ResponseUser> => {
        const response = await axios.get(`${API_URL}/users/traer-usuarios-con-paginacion`, {
            headers: { Authorization: `Bearer ${accessToken}` },
            params: {
                page,
                limit,
                ...filters
            }
        });
        return response.data;
    },

    getUserById: async (accessToken: string, userId: number): Promise<ResponseUserById> => {
        const response = await axios.get(`${API_URL}/users/traer-usuario/${userId}`, {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        return response.data;
    },
    
    createUser: async (accessToken: string, userData: Omit<User, 'id'>): Promise<ResponseUserById> => {
        // Pass the userData directly to the backend, including the roles property
        // The backend will handle the role assignment
        const response = await axios.post(`${API_URL}/users/crear-usuario`, userData, {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        return response.data;
    },
    
    updateUser: async (accessToken: string, userId: number, userData: Partial<User>): Promise<ResponseUserById> => {
        const response = await axios.put(`${API_URL}/users/editar-usuario/${userId}`, userData, {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        return response.data;
    },
    
    deleteUser: async (accessToken: string, userId: number): Promise<ResponseUserById> => {
        const response = await axios.delete(`${API_URL}/users/eliminar-usuario/${userId}`, {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        return response.data;
    },

    assignRoles: async (accessToken: string, userId: number, roleIds: number[]): Promise<ResponseUserById> => {
        const response = await axios.post(`${API_URL}/users/assign-roles`, {
            userId,
            roleIds
        }, {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        return response.data;
    },
};
