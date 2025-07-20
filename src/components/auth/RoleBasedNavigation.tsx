'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { RoleBasedNavigationProps } from '@/types/roles';
import { useRoles } from '@/hooks/useRoles';
import { filterNavigationByRoles } from '@/lib/utils/roleUtils';
import { cn } from '@/lib/utils';

/**
 * Componente de navegación que filtra elementos según los roles del usuario
 */
export function RoleBasedNavigation({ 
  items, 
  className 
}: RoleBasedNavigationProps) {
  const { userRoles, isAuthenticated } = useRoles();
  const pathname = usePathname();

  // Si no está autenticado, no mostrar navegación
  if (!isAuthenticated) {
    return null;
  }

  // Filtrar elementos de navegación según roles
  const allowedItems = filterNavigationByRoles(items, userRoles);

  if (allowedItems.length === 0) {
    return null;
  }

  return (
    <nav className={cn("space-y-2", className)}>
      {allowedItems.map((item) => {
        const isActive = pathname === item.path;
        
        return (
          <Link
            key={item.path}
            href={item.path}
            className={cn(
              "flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors",
              "hover:bg-white/10 hover:text-white",
              isActive 
                ? "bg-white/20 text-white" 
                : "text-gray-300"
            )}
          >
            {item.icon && (
              <span className="mr-3 text-lg">
                {item.icon}
              </span>
            )}
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
