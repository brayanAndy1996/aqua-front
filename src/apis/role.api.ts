import { Role, ResponseRoles, ResponseRole } from '@/types/role';
import { apiGet, apiPost, apiPut, apiDelete, buildUrl } from '@/lib/api/apiWrapper';

export const roleApi = {
    getRoles: async (): Promise<ResponseRoles> => {
        const url = buildUrl('/roles/traer-roles');
        return await apiGet<ResponseRoles>(url);
    },
    getOnlyRoles: async (): Promise<ResponseRoles> => {
        const url = buildUrl('/roles/traer-solo-roles');
        return await apiGet<ResponseRoles>(url);
    },
    
    createRole: async (roleData: Omit<Role, 'id'>): Promise<ResponseRole> => {
        return await apiPost<ResponseRole, Omit<Role, 'id'>>('/roles/crear-rol', roleData);
    },
    
    updateRole: async (roleId: number, roleData: Partial<Role>): Promise<ResponseRole> => {
        return await apiPut<ResponseRole, Partial<Role>>(`/roles/editar-rol/${roleId}`, roleData);
    },
    
    deleteRole: async (roleId: number): Promise<ResponseRole> => {
        return await apiDelete<ResponseRole>(`/roles/eliminar-rol/${roleId}`);
    },
};
