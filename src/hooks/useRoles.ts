import { useSession } from 'next-auth/react';
import { useMemo } from 'react';
import { NextAuthSession } from '@/types/auth';
import { RoleName } from '@/types/roles';
import { 
  getRolesFromSession, 
  isValidSession, 
  getUserInfo 
} from '@/lib/utils/authHelpers';
import { 
  hasAnyRole, 
  hasAllRoles, 
  isAdmin,
  canAccessProducts,
  canAccessReports,
  getPrimaryRole 
} from '@/lib/utils/roleUtils';

export function useRoles() {
  const { data: session, status } = useSession();

  const userInfo = useMemo(() => {
    return getUserInfo(session as NextAuthSession | null);
  }, [session]);

  const userRoles = useMemo(() => {
    return getRolesFromSession(session as NextAuthSession | null);
  }, [session]);

  const isAuthenticated = useMemo(() => {
    return isValidSession(session as NextAuthSession | null);
  }, [session]);

  const isLoading = status === 'loading';

  // Funciones de verificación de roles
  const checkRole = useMemo(() => ({
    hasAny: (allowedRoles: RoleName[]) => hasAnyRole(userRoles, allowedRoles),
    hasAll: (requiredRoles: RoleName[]) => hasAllRoles(userRoles, requiredRoles),
    isAdmin: () => isAdmin(userRoles),
    canAccessProducts: () => canAccessProducts(userRoles),
    canAccessReports: () => canAccessReports(userRoles),
  }), [userRoles]);

  const primaryRole = useMemo(() => {
    return getPrimaryRole(userRoles);
  }, [userRoles]);

  return {
    // Estado de autenticación
    isAuthenticated,
    isLoading,
    
    // Información del usuario
    user: userInfo,
    userRoles,
    primaryRole,
    
    // Funciones de verificación
    checkRole,
    
    // Sesión original para casos especiales
    session,
  };
}
