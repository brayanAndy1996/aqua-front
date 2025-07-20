import { signIn, signOut, useSession } from 'next-auth/react';
import { useState } from 'react';
import { LoginCredentials } from '@/types/auth';
import { useRoles } from './useRoles';

export function useAuth() {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { data: session, status } = useSession();
  const roles = useRoles();

  const login = async (credentials: LoginCredentials) => {
    setIsLoggingIn(true);
    try {
      const result = await signIn('credentials', {
        email: credentials.email,
        password: credentials.password,
        redirect: false,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      return result;
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    } finally {
      setIsLoggingIn(false);
    }
  };

  const logout = async () => {
    setIsLoggingOut(true);
    try {
      await signOut({ redirect: false });
    } catch (error) {
      console.error('Error en logout:', error);
      throw error;
    } finally {
      setIsLoggingOut(false);
    }
  };

  return {
    // Estado de autenticación
    isAuthenticated: roles.isAuthenticated,
    isLoading: status === 'loading' || isLoggingIn || isLoggingOut,
    isLoggingIn,
    isLoggingOut,
    
    // Información del usuario y roles
    user: roles.user,
    userRoles: roles.userRoles,
    primaryRole: roles.primaryRole,
    checkRole: roles.checkRole,
    
    // Funciones de autenticación
    login,
    logout,
    
    // Sesión original
    session,
  };
}
