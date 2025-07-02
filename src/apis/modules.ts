import axios from 'axios';
import { ModuleResponse } from '@/types/module';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
export const moduleApi = {
    fetchModules: async (accessToken: string): Promise<ModuleResponse> => {
        try {
            const response = await axios.get<ModuleResponse>(`${API_URL}/modules/traer-modulos`, {
                headers: { Authorization: `Bearer ${accessToken}` }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching modules:', error);
            throw error;
        }
    },
    fetchModuleTree: async (accessToken: string): Promise<ModuleResponse> => {
        try {
            const response = await axios.get<ModuleResponse>(`${API_URL}/modules/traer-arbol-modulos`, {
                headers: { Authorization: `Bearer ${accessToken}` }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching module tree:', error);
            throw error;
        }
    },
};
