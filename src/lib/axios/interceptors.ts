import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { getSession } from 'next-auth/react';
import { handleJWTExpiredLogout } from '@/lib/utils/authUtils';

// Configuración base de axios
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://aqua-back-9zpl.onrender.com';

// Crear instancia de axios
export const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

// Interfaces para la cola de peticiones fallidas
interface QueueItem {
  resolve: (value?: string | null) => void;
  reject: (error?: Error) => void;
}

interface ApiErrorResponse {
  errors?: string[] | string;
  message?: string;
}

// Flag para evitar múltiples llamadas de logout simultáneas
let isRefreshing = false;
let failedQueue: QueueItem[] = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  
  failedQueue = [];
};

// Interceptor de request - Agregar token automáticamente
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      const session = await getSession();
      if (session?.user?.accessToken) {
        config.headers.Authorization = `Bearer ${session.user.accessToken}`;
      }
    } catch (error) {
      console.error('Error getting session in request interceptor:', error);
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de response - Manejar errores de autenticación
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    
    // Si es error 401 y no hemos intentado renovar el token
    if (error.response?.status === 401 && !originalRequest._retry) {
      
      // Verificar si el error es específicamente por token expirado
      const errorMessage = error.response?.data as ApiErrorResponse;
      const isTokenExpired = 
        errorMessage?.errors === 'Not authorized, token failed' ||
        errorMessage?.message === 'Token expired' ||
        errorMessage?.errors === 'jwt expired' ||
        error.response?.statusText === 'Unauthorized';

      if (isTokenExpired) {
        if (isRefreshing) {
          // Si ya estamos renovando, agregar a la cola
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          }).then(() => {
            // Reintentar la petición original
            return apiClient(originalRequest);
          }).catch((err) => {
            return Promise.reject(err);
          });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          // Intentar obtener una nueva sesión
          const session = await getSession();
          
          if (session?.user?.accessToken) {
            // Si tenemos token, procesar la cola y reintentar
            processQueue(null, session.user.accessToken);
            originalRequest.headers.Authorization = `Bearer ${session.user.accessToken}`;
            return apiClient(originalRequest);
          } else {
            // No hay sesión válida, hacer logout
            throw new Error('No valid session');
          }
        } catch (refreshError) {
          // Error al renovar, hacer logout
          const errorToPass = refreshError instanceof Error ? refreshError : new Error('Unknown refresh error');
          processQueue(errorToPass, null);
          
          // Usar función centralizada para logout por JWT expirado
          await handleJWTExpiredLogout({
            showToast: true,
            customMessage: 'Tu sesión ha expirado. Serás redirigido al login.'
          });
          
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }
    }

    // Para otros errores, simplemente rechazar
    return Promise.reject(error);
  }
);

export default apiClient;
