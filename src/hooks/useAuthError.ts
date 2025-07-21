import { useSession } from 'next-auth/react';
import { useCallback, useRef } from 'react';
import { AxiosError } from 'axios';
import { handleJWTExpiredLogout } from '@/lib/utils/authUtils';

interface AuthErrorOptions {
  showToast?: boolean;
  redirectToLogin?: boolean;
  customErrorMessage?: string;
}

interface ApiErrorResponse {
  errors?: string[] | string;
  message?: string;
}

export const useAuthError = () => {
  const { data: session, status } = useSession();
  const logoutInProgress = useRef(false);

  const handleAuthError = useCallback(async (
    error: unknown,
    options: AuthErrorOptions = {}
  ) => {
    const {
      showToast = true,
      redirectToLogin = true,
      customErrorMessage
    } = options;

    // Verificar si es un error de Axios
    if (error && typeof error === 'object' && 'isAxiosError' in error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      
      // Verificar si es error 401 (no autorizado)
      if (axiosError.response?.status === 401) {
        const errorData = axiosError.response.data;
        
        // Verificar si es específicamente un error de token expirado
        const isTokenExpired = 
          errorData?.errors === 'Not authorized, token failed' ||
          errorData?.message === 'Token expired' ||
          errorData?.errors === 'jwt expired' ||
          axiosError.response.statusText === 'Unauthorized';

        if (isTokenExpired && !logoutInProgress.current) {
          logoutInProgress.current = true;
          
          if (redirectToLogin) {
            // Usar función centralizada para logout por JWT expirado
            await handleJWTExpiredLogout({
              showToast,
              customMessage: customErrorMessage
            });
          } else if (showToast) {
            // Solo mostrar toast sin redireccionar
            const { showDangerToast } = await import('@/components/toastUtils');
            const message = customErrorMessage || 'Tu sesión ha expirado. Serás redirigido al login.';
            showDangerToast('Sesión Expirada', message);
          }

          return {
            isTokenExpired: true,
            handled: true,
            error: axiosError
          };
        }
      }
    }

    return {
      isTokenExpired: false,
      handled: false,
      error
    };
  }, []);

  const isAuthenticated = status === 'authenticated' && !!session?.user?.accessToken;
  
  const getValidToken = useCallback((): string | null => {
    if (isAuthenticated && session?.user?.accessToken) {
      return session.user.accessToken;
    }
    return null;
  }, [isAuthenticated, session]);

  return {
    handleAuthError,
    isAuthenticated,
    getValidToken,
    session,
    status
  };
};

export default useAuthError;
