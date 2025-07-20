import { Role } from '@/types/auth';
import { RoleName, ROLE_ID_MAP, ROLES } from '@/types/roles';

/**
 * Convierte un array de roles de la API a nombres de roles
 */
export function mapRolesToNames(roles: Role[]): RoleName[] {
  return roles.map(role => ROLE_ID_MAP[role.id]).filter(Boolean);
}

/**
 * Verifica si el usuario tiene al menos uno de los roles permitidos
 */
export function hasAnyRole(userRoles: RoleName[], allowedRoles: RoleName[]): boolean {
  return allowedRoles.some(role => userRoles.includes(role));
}

/**
 * Verifica si el usuario tiene todos los roles requeridos
 */
export function hasAllRoles(userRoles: RoleName[], requiredRoles: RoleName[]): boolean {
  return requiredRoles.every(role => userRoles.includes(role));
}

/**
 * Verifica si el usuario es administrador
 */
export function isAdmin(userRoles: RoleName[]): boolean {
  return userRoles.includes(ROLES.ADMINISTRADOR);
}

/**
 * Verifica si el usuario puede acceder al módulo de productos
 */
export function canAccessProducts(userRoles: RoleName[]): boolean {
  return hasAnyRole(userRoles, [ROLES.ADMINISTRADOR, ROLES.ASISTENTE]);
}

/**
 * Verifica si el usuario puede acceder al módulo de reportes
 */
export function canAccessReports(userRoles: RoleName[]): boolean {
  return hasAnyRole(userRoles, [ROLES.ADMINISTRADOR, ROLES.ENTRENADOR]);
}

/**
 * Obtiene el rol principal del usuario (el de mayor jerarquía)
 */
export function getPrimaryRole(userRoles: RoleName[]): RoleName | null {
  const roleHierarchy: RoleName[] = [
    ROLES.ADMINISTRADOR,
    ROLES.ENTRENADOR,
    ROLES.ASISTENTE,
    ROLES.PADRE,
    ROLES.ESTUDIANTE,
  ];

  for (const role of roleHierarchy) {
    if (userRoles.includes(role)) {
      return role;
    }
  }

  return null;
}

/**
 * Filtra elementos de navegación basado en los roles del usuario
 */
export function filterNavigationByRoles<T extends { roles: RoleName[] }>(
  items: T[],
  userRoles: RoleName[]
): T[] {
  return items.filter(item => hasAnyRole(userRoles, item.roles));
}
