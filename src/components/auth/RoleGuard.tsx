'use client';

import React from 'react';
import { RoleGuardProps } from '@/types/roles';
import { useRoles } from '@/hooks/useRoles';
import { LoadingAuth } from './LoadingAuth';
import { UnauthorizedAccess } from './UnauthorizedAccess';

/**
 * Componente que renderiza contenido solo si el usuario tiene los roles permitidos
 */
export function RoleGuard({ 
  allowedRoles, 
  children, 
  fallback 
}: RoleGuardProps) {
  const { isLoading, isAuthenticated, checkRole } = useRoles();

  // Mostrar loading mientras se verifica la autenticación
  if (isLoading) {
    return <LoadingAuth />;
  }

  // Si no está autenticado, mostrar componente no autorizado
  if (!isAuthenticated) {
    return fallback || <UnauthorizedAccess message="Debes iniciar sesión para acceder a este contenido" />;
  }

  // Verificar si tiene alguno de los roles permitidos
  const hasPermission = checkRole.hasAny(allowedRoles);

  if (!hasPermission) {
    return fallback || <UnauthorizedAccess message="No tienes permisos para acceder a este contenido" />;
  }

  return <>{children}</>;
}
