import { NextAuthSession } from '@/types/auth';
import { RoleName } from '@/types/roles';
import { mapRolesToNames } from './roleUtils';

/**
 * Extrae los nombres de roles de una sesión de NextAuth
 */
export function getRolesFromSession(session: NextAuthSession | null): RoleName[] {
  if (!session?.user?.roles) return [];
  return mapRolesToNames(session.user.roles);
}

/**
 * Verifica si una sesión está autenticada y tiene roles válidos
 */
export function isValidSession(session: NextAuthSession | null): boolean {
  return !!(session?.user?.id && session?.user?.roles?.length);
}

/**
 * Obtiene información del usuario desde la sesión
 */
export function getUserInfo(session: NextAuthSession | null) {
  if (!session?.user) return null;

  return {
    id: session.user.id,
    email: session.user.email,
    nombre_completo: session.user.nombre_completo,
    roles: getRolesFromSession(session),
    accessToken: session.user.accessToken,
  };
}

/**
 * Formatea los roles para mostrar en la UI
 */
export function formatRolesForDisplay(roles: RoleName[]): string {
  if (roles.length === 0) return 'Sin roles';
  if (roles.length === 1) return roles[0];
  return roles.join(', ');
}

/**
 * Obtiene el icono del rol basado en el nombre
 */
export function getRoleIcon(roleName: RoleName): string {
  const iconMap: Record<RoleName, string> = {
    'Administrador': 'shield',
    'Entrenador': 'user-cog',
    'Asistente': 'clipboard-list',
    'Padre': 'parent',
    'Estudiante': 'graduation-cap',
  };

  return iconMap[roleName] || 'user';
}
