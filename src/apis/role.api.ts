import axios from 'axios';
import { Role, ResponseRoles, ResponseRole } from '@/types/role';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const roleApi = {
    getRoles: async (): Promise<ResponseRoles> => {
        
        const token = localStorage.getItem('token');
        const response = await axios.get(`${API_URL}/roles/traer-roles`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },
    getOnlyRoles: async (accessToken: string): Promise<ResponseRoles> => {
        const response = await axios.get(`${API_URL}/roles/traer-solo-roles`, {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        return response.data;
    },
    
    createRole: async (roleData: Omit<Role, 'id'>): Promise<ResponseRole> => {
        const token = localStorage.getItem('token');
        const response = await axios.post(`${API_URL}/roles/crear-rol`, roleData, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
        
    },
    
    updateRole: async (roleId: number, roleData: Partial<Role>): Promise<ResponseRole> => {
        const token = localStorage.getItem('token');
        const response = await axios.put(`${API_URL}/roles/editar-rol/${roleId}`, roleData, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },
    
    deleteRole: async (roleId: number): Promise<ResponseRole> => {
        const token = localStorage.getItem('token');
        const response = await axios.delete(`${API_URL}/roles/eliminar-rol/${roleId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },
};
