import { User, ResponseUser, ResponseUserById } from '@/types/user';
import { apiGet, apiPost, apiPut, apiDelete, buildUrl } from '@/lib/api/apiWrapper';

export const userApi = {
    getUsers: async (): Promise<ResponseUser> => {
        return await apiGet<ResponseUser>('/users/traer-usuarios');
    },

    getUsersWithPagination: async (page: number, limit: number, filters: { [key: string]: string | number | boolean } = {}): Promise<ResponseUser> => {
        const url = buildUrl('/users/traer-usuarios-con-paginacion', {
            page,
            limit,
            ...filters
        });
        return await apiGet<ResponseUser>(url);
    },

    getUserById: async (userId: number): Promise<ResponseUserById> => {
        return await apiGet<ResponseUserById>(`/users/traer-usuario/${userId}`);
    },
    
    createUser: async (userData: Omit<User, 'id'>): Promise<ResponseUserById> => {
        // Pass the userData directly to the backend, including the roles property
        // The backend will handle the role assignment
        return await apiPost<ResponseUserById, Omit<User, 'id'>>('/users/crear-usuario', userData);
    },
    
    updateUser: async (userId: number, userData: Partial<User>): Promise<ResponseUserById> => {
        return await apiPut<ResponseUserById, Partial<User>>(`/users/editar-usuario/${userId}`, userData);
    },
    
    deleteUser: async (userId: number): Promise<ResponseUserById> => {
        return await apiDelete<ResponseUserById>(`/users/eliminar-usuario/${userId}`);
    },
    
    assignRoles: async (userId: number, roleIds: number[]): Promise<ResponseUserById> => {
        return await apiPost<ResponseUserById, { userId: number; roleIds: number[] }>('/users/assign-roles', {
            userId,
            roleIds
        });
    },
};
