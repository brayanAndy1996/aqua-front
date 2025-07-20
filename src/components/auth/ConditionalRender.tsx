'use client';

import React from 'react';
import { ConditionalRenderProps } from '@/types/roles';
import { useRoles } from '@/hooks/useRoles';
import { LoadingAuth } from './LoadingAuth';

/**
 * Componente maestro para renderizado condicional basado en roles
 */
export function ConditionalRender({ 
  condition, 
  children, 
  fallback 
}: ConditionalRenderProps) {
  const { isLoading, isAuthenticated, checkRole } = useRoles();

  // Mostrar loading mientras se verifica la autenticación
  if (isLoading) {
    return <LoadingAuth />;
  }

  // Si no está autenticado, mostrar fallback
  if (!isAuthenticated) {
    return <>{fallback || null}</>;
  }

  // Verificar condición de roles
  const hasPermission = checkRole.hasAny(condition.roles);

  if (!hasPermission) {
    return <>{fallback || null}</>;
  }

  return <>{children}</>;
}
