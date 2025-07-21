import { signOut } from 'next-auth/react';
import { showDangerToast } from '@/components/toastUtils';
import { AUTH_ROUTES, AUTH_CONFIG } from '@/config/auth.config';

/**
 * Configuración centralizada para el manejo de logout por JWT expirado
 */
const JWT_LOGOUT_CONFIG = {
  callbackUrl: AUTH_ROUTES.LOGIN,
  redirect: true,
  toastDelay: AUTH_CONFIG.REDIRECT_DELAY,
  toastTitle: AUTH_CONFIG.TOAST.TITLE_SESSION_EXPIRED,
  toastMessage: AUTH_CONFIG.MESSAGES.SESSION_EXPIRED
} as const;

/**
 * Función centralizada para manejar logout por JWT expirado
 * 
 * Esta función proporciona un comportamiento consistente en toda la aplicación
 * cuando se detecta que el JWT ha expirado.
 * 
 * @param options - Opciones para personalizar el comportamiento del logout
 */
export interface JWTLogoutOptions {
  showToast?: boolean;
  customMessage?: string;
  customCallbackUrl?: string;
  delay?: number;
  immediate?: boolean;
}

export const handleJWTExpiredLogout = async (options: JWTLogoutOptions = {}) => {
  const {
    showToast = true,
    customMessage = JWT_LOGOUT_CONFIG.toastMessage,
    customCallbackUrl = JWT_LOGOUT_CONFIG.callbackUrl,
    delay = JWT_LOGOUT_CONFIG.toastDelay,
    immediate = false
  } = options;

  // Mostrar toast de notificación si está habilitado
  if (showToast) {
    showDangerToast(JWT_LOGOUT_CONFIG.toastTitle, customMessage);
  }

  // Función para ejecutar el logout
  const executeLogout = () => {
    signOut({
      callbackUrl: customCallbackUrl,
      redirect: true
    });
  };

  // Ejecutar logout inmediatamente o con delay
  if (immediate) {
    executeLogout();
  } else {
    setTimeout(executeLogout, delay);
  }
};

/**
 * Función para verificar si una URL es válida para redirect
 */
export const isValidRedirectUrl = (url: string): boolean => {
  try {
    // Verificar que sea una URL relativa válida o una URL absoluta del mismo dominio
    if (url.startsWith('/')) {
      return true;
    }
    
    const parsedUrl = new URL(url);
    const currentOrigin = typeof window !== 'undefined' ? window.location.origin : '';
    
    return parsedUrl.origin === currentOrigin;
  } catch {
    return false;
  }
};

/**
 * Función para construir URL de callback segura
 */
export const buildSecureCallbackUrl = (intendedUrl?: string): string => {
  // Si no hay URL intencionada o no es válida, usar la URL por defecto
  if (!intendedUrl || !isValidRedirectUrl(intendedUrl)) {
    return JWT_LOGOUT_CONFIG.callbackUrl;
  }

  // Si es una URL válida, construir la URL de callback con el redirect
  const loginUrl = new URL(JWT_LOGOUT_CONFIG.callbackUrl, typeof window !== 'undefined' ? window.location.origin : '');
  loginUrl.searchParams.set('callbackUrl', intendedUrl);
  
  return loginUrl.toString();
};

/**
 * Hook para obtener la configuración de logout
 */
export const useJWTLogoutConfig = () => {
  return {
    ...JWT_LOGOUT_CONFIG,
    handleLogout: handleJWTExpiredLogout,
    buildCallbackUrl: buildSecureCallbackUrl,
    isValidUrl: isValidRedirectUrl
  };
};

const authUtils = {
  handleJWTExpiredLogout,
  buildSecureCallbackUrl,
  isValidRedirectUrl,
  useJWTLogoutConfig,
  JWT_LOGOUT_CONFIG
};

export default authUtils;
