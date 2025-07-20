'use client';

import React from 'react';
import { RoleName } from '@/types/roles';
import { RoleGuard } from '@/components/auth/RoleGuard';

/**
 * Higher-Order Component que protege un componente con verificación de roles
 */
export function withRoleProtection<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  allowedRoles: RoleName[],
  fallback?: React.ReactNode
) {
  const ProtectedComponent = (props: P) => {
    return (
      <RoleGuard allowedRoles={allowedRoles} fallback={fallback}>
        <WrappedComponent {...props} />
      </RoleGuard>
    );
  };

  // Preservar el nombre del componente para debugging
  ProtectedComponent.displayName = `withRoleProtection(${
    WrappedComponent.displayName || WrappedComponent.name || 'Component'
  })`;

  return ProtectedComponent;
}

/**
 * HOC específico para componentes que solo pueden ver administradores
 */
export function withAdminOnly<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  fallback?: React.ReactNode
) {
  return withRoleProtection(WrappedComponent, ['Administrador'], fallback);
}

/**
 * HOC específico para componentes del módulo de productos
 */
export function withProductsAccess<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  fallback?: React.ReactNode
) {
  return withRoleProtection(WrappedComponent, ['Administrador', 'Asistente'], fallback);
}

/**
 * HOC específico para componentes del módulo de reportes
 */
export function withReportsAccess<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  fallback?: React.ReactNode
) {
  return withRoleProtection(WrappedComponent, ['Administrador', 'Entrenador'], fallback);
}
