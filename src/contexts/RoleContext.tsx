'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useRoles } from '@/hooks/useRoles';
import { RoleName } from '@/types/roles';

interface RoleContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  userRoles: RoleName[];
  primaryRole: RoleName | null;
  checkRole: {
    hasAny: (allowedRoles: RoleName[]) => boolean;
    hasAll: (requiredRoles: RoleName[]) => boolean;
    isAdmin: () => boolean;
    canAccessProducts: () => boolean;
    canAccessReports: () => boolean;
  };
  user: {
    id: string;
    email: string;
    nombre_completo: string;
    roles: RoleName[];
    accessToken: string;
  } | null;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

interface RoleProviderProps {
  children: ReactNode;
}

/**
 * Proveedor de contexto para gestión global de roles
 */
export function RoleProvider({ children }: RoleProviderProps) {
  const roleData = useRoles();

  return (
    <RoleContext.Provider value={roleData}>
      {children}
    </RoleContext.Provider>
  );
}

/**
 * Hook para usar el contexto de roles
 */
export function useRoleContext() {
  const context = useContext(RoleContext);
  
  if (context === undefined) {
    throw new Error('useRoleContext must be used within a RoleProvider');
  }
  
  return context;
}
