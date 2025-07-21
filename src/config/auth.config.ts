/**
 * Configuración de rutas y comportamiento de autenticación para AquaControl
 */

export const AUTH_ROUTES = {
  // Ruta principal de login
  LOGIN: '/auth/login',
  
  // Ruta de registro (si existe)
  REGISTER: '/auth/register',
  
  // Ruta de recuperación de contraseña (si existe)
  FORGOT_PASSWORD: '/auth/forgot-password',
  
  // Ruta por defecto después del login exitoso
  DEFAULT_REDIRECT: '/dashboard',
  
  // Rutas públicas que no requieren autenticación
  PUBLIC_ROUTES: [
    '/auth/login',
    '/auth/register',
    '/auth/forgot-password',
    '/auth/reset-password',
    '/',
    '/about',
    '/contact'
  ],
  
  // Rutas protegidas que requieren autenticación
  PROTECTED_ROUTES: [
    '/dashboard',
    '/security',
    '/productos',
    '/reportes',
    '/configuracion'
  ]
} as const;

export const AUTH_CONFIG = {
  // Tiempo de espera antes de redirigir (en milisegundos)
  REDIRECT_DELAY: 2000,
  
  // Mensajes de error estándar
  MESSAGES: {
    SESSION_EXPIRED: 'Tu sesión ha expirado. Serás redirigido al login.',
    UNAUTHORIZED: 'No tienes permisos para acceder a esta página.',
    LOGIN_REQUIRED: 'Debes iniciar sesión para continuar.',
    TOKEN_INVALID: 'Tu sesión es inválida. Por favor, inicia sesión nuevamente.'
  },
  
  // Configuración de toast
  TOAST: {
    TITLE_SESSION_EXPIRED: 'Sesión Expirada',
    TITLE_UNAUTHORIZED: 'Acceso Denegado',
    TITLE_LOGIN_REQUIRED: 'Login Requerido'
  }
} as const;

/**
 * Función para verificar si una ruta es pública
 */
export const isPublicRoute = (pathname: string): boolean => {
  return AUTH_ROUTES.PUBLIC_ROUTES.some(route => {
    if (route === pathname) return true;
    if (route.endsWith('*')) {
      const baseRoute = route.slice(0, -1);
      return pathname.startsWith(baseRoute);
    }
    return false;
  });
};

/**
 * Función para verificar si una ruta está protegida
 */
export const isProtectedRoute = (pathname: string): boolean => {
  return AUTH_ROUTES.PROTECTED_ROUTES.some(route => {
    if (route === pathname) return true;
    if (route.endsWith('*')) {
      const baseRoute = route.slice(0, -1);
      return pathname.startsWith(baseRoute);
    }
    return pathname.startsWith(route);
  });
};

/**
 * Función para obtener la URL de redirección después del login
 */
export const getPostLoginRedirectUrl = (intendedUrl?: string): string => {
  // Si hay una URL intencionada y es válida, usarla
  if (intendedUrl && !isPublicRoute(intendedUrl) && isProtectedRoute(intendedUrl)) {
    return intendedUrl;
  }
  
  // Caso contrario, usar la URL por defecto
  return AUTH_ROUTES.DEFAULT_REDIRECT;
};

/**
 * Función para construir URL de login con callback
 */
export const buildLoginUrl = (callbackUrl?: string): string => {
  const loginUrl = new URL(AUTH_ROUTES.LOGIN, typeof window !== 'undefined' ? window.location.origin : '');
  
  if (callbackUrl && callbackUrl !== AUTH_ROUTES.LOGIN) {
    loginUrl.searchParams.set('callbackUrl', callbackUrl);
  }
  
  return loginUrl.pathname + loginUrl.search;
};

const authConfig = {
  AUTH_ROUTES,
  AUTH_CONFIG,
  isPublicRoute,
  isProtectedRoute,
  getPostLoginRedirectUrl,
  buildLoginUrl
};

export default authConfig;
