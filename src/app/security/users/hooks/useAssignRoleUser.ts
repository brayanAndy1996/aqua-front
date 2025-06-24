import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { roleApi } from '@/apis/role.api';
import { userApi } from '@/apis/user.api';
import { ResponseUserById, User } from '@/types/user';
import useSWR from 'swr';
import { showSuccessToast, showDangerToast } from '@/components/toastUtils';
import { handleErrors } from '@/lib/utils/errors';
import { Role } from '@/types/role';

interface UseAssignRoleUserProps {
  user: User;
  onSuccess?: () => void;
  initialSelectedRoles?: string[];
}

interface UseAssignRoleUserReturn {
  roles: Role[];
  user: User | null;
  selectedRoles: string[];
  loading: boolean;
  handleRoleChange: (values: string[]) => void;
  handleSubmit: () => Promise<void>;
}

export function useAssignRoleUser({ user, onSuccess, initialSelectedRoles = [] }: UseAssignRoleUserProps): UseAssignRoleUserReturn {
  const { data: session, status } = useSession();
  const [selectedRoles, setSelectedRoles] = useState<string[]>(initialSelectedRoles);
  const [loading, setLoading] = useState(false);
  const [initialRolesSet, setInitialRolesSet] = useState(false);
  
  // Fetch roles using SWR with proper typing
  const { data: rolesResponse, error: rolesError } = useSWR<{ data: Role[] }>(
    status === 'authenticated' ? 'roles' : null,
    () => roleApi.getOnlyRoles(session?.user?.accessToken || ''),
    {
      revalidateOnFocus: false,
      revalidateOnMount: true,
    }
  );

  const roles = rolesResponse?.data || [];

  // Fetch user details using SWR with proper typing
  const { data: userResponse, error: userError, mutate: mutateUser } = useSWR<ResponseUserById>(
    user?.id && status === 'authenticated' ? ['user', user.id] : null,
    () => userApi.getUserById(session?.user?.accessToken || '', user?.id || 0)
      .then(response => ({
        ...response,
        data: {
          ...response.data,
          roles: response.data.roles || []
        }
      })),
    {
      revalidateOnFocus: false,
      revalidateOnMount: true,
    }
  );

  const userData = userResponse?.data;

  // Handle errors
  useEffect(() => {
    if (rolesError) {
      handleErrors(rolesError);
    }
    if (userError) {
      handleErrors(userError);
    }
  }, [rolesError, userError]);

  // Set initial selected roles when user data is loaded
  useEffect(() => {
    // If we have initialSelectedRoles, use those instead of fetching from userData
    if (initialSelectedRoles.length > 0 && !initialRolesSet) {
      setInitialRolesSet(true);
      // No need to set selectedRoles as it's already initialized with initialSelectedRoles
    } else if (userData?.roles?.length && !initialRolesSet) {
      const userRoleIds = userData.roles.map(role => role.id.toString());
      setSelectedRoles(userRoleIds);
      setInitialRolesSet(true);
    }
  }, [userData, initialRolesSet, initialSelectedRoles]);

  // Handle role selection change
  const handleRoleChange = (values: string[]) => {
    setSelectedRoles(values);
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!user?.id || !session?.user?.accessToken) {
      showDangerToast('Error', 'No se encontró información de autenticación');
      return;
    }
    
    setLoading(true);
    try {
      const response = await userApi.assignRoles(session.user.accessToken, user.id, selectedRoles.map(Number));
      showSuccessToast('Éxito', response.message);
      if (onSuccess) {
        onSuccess();
      }
      mutateUser();
    } catch (error) {
      handleErrors(error);
    } finally {
      setLoading(false);
    }
  };

  return {
    roles,
    user: userData || null,
    selectedRoles,
    loading,
    handleRoleChange,
    handleSubmit,
  } as const;
}
