
import { ModuleResponse } from '@/types/module';
import { apiGet, buildUrl } from '@/lib/api/apiWrapper';
export const moduleApi = {
    fetchModules: async (): Promise<ModuleResponse> => {
        const url = buildUrl(`/modules/traer-modulos`);
        return await apiGet<ModuleResponse>(url);
    },
    fetchModuleTree: async (): Promise<ModuleResponse> => {
        const url = buildUrl(`/modules/traer-arbol-modulos`);
        return await apiGet<ModuleResponse>(url);
    },
};
