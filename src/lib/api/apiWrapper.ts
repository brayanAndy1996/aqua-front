import { AxiosResponse } from 'axios';
import { apiClient } from '@/lib/axios/interceptors';
import { handleErrors } from '@/lib/utils/errors';

// Tipo genérico para respuestas de API
export interface ApiResponse<T = unknown> {
  data: T;
  success: boolean;
  message?: string;
}

// Opciones para las llamadas a la API
export interface ApiCallOptions {
  showErrorToast?: boolean;
  customErrorMessage?: string;
  skipJWTHandling?: boolean;
}

// Wrapper principal para llamadas GET
export const apiGet = async <T = unknown>(
  url: string,
  options: ApiCallOptions = {}
): Promise<T> => {
  try {
    const response: AxiosResponse<T> = await apiClient.get(url);
    return response.data;
  } catch (error) {
    console.log("🚀 ~ error:", error)
    const errorResult = handleErrors(error, {
      showToast: options.showErrorToast,
      customMessage: options.customErrorMessage,
      skipJWTHandling: options.skipJWTHandling
    });
    console.log("🚀 ~ errorResult:", errorResult)
    
    // Re-lanzar el error para que el hook que lo llama pueda manejarlo
    throw errorResult;
  }
};

// Wrapper para llamadas POST
export const apiPost = async <T = unknown, D = unknown>(
  url: string,
  data?: D,
  options: ApiCallOptions = {}
): Promise<T> => {
  try {
    const response: AxiosResponse<T> = await apiClient.post(url, data);
    return response.data;
  } catch (error) {
    const errorResult = handleErrors(error, {
      showToast: options.showErrorToast,
      customMessage: options.customErrorMessage,
      skipJWTHandling: options.skipJWTHandling
    });
    
    throw errorResult;
  }
};

// Wrapper para llamadas PUT
export const apiPut = async <T = unknown, D = unknown>(
  url: string,
  data?: D,
  options: ApiCallOptions = {}
): Promise<T> => {
  try {
    const response: AxiosResponse<T> = await apiClient.put(url, data);
    return response.data;
  } catch (error) {
    const errorResult = handleErrors(error, {
      showToast: options.showErrorToast,
      customMessage: options.customErrorMessage,
      skipJWTHandling: options.skipJWTHandling
    });
    
    throw errorResult;
  }
};

// Wrapper para llamadas DELETE
export const apiDelete = async <T = unknown>(
  url: string,
  options: ApiCallOptions = {}
): Promise<T> => {
  try {
    const response: AxiosResponse<T> = await apiClient.delete(url);
    return response.data;
  } catch (error) {
    const errorResult = handleErrors(error, {
      showToast: options.showErrorToast,
      customMessage: options.customErrorMessage,
      skipJWTHandling: options.skipJWTHandling
    });
    
    throw errorResult;
  }
};

// Wrapper para llamadas PATCH
export const apiPatch = async <T = unknown, D = unknown>(
  url: string,
  data?: D,
  options: ApiCallOptions = {}
): Promise<T> => {
  try {
    const response: AxiosResponse<T> = await apiClient.patch(url, data);
    return response.data;
  } catch (error) {
    const errorResult = handleErrors(error, {
      showToast: options.showErrorToast,
      customMessage: options.customErrorMessage,
      skipJWTHandling: options.skipJWTHandling
    });
    
    throw errorResult;
  }
};

// Función de conveniencia para crear URLs con parámetros
export const buildUrl = (baseUrl: string, params?: Record<string, string | number | boolean>): string => {
  if (!params) return baseUrl;
  
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, String(value));
    }
  });
  
  const queryString = searchParams.toString();
  return queryString ? `${baseUrl}?${queryString}` : baseUrl;
};

// Exportar el cliente para casos especiales donde se necesite acceso directo
export { apiClient };

const apiWrapper = {
  get: apiGet,
  post: apiPost,
  put: apiPut,
  delete: apiDelete,
  patch: apiPatch,
  buildUrl,
  client: apiClient
};

export default apiWrapper;
