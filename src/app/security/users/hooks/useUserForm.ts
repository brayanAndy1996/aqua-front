import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { userApi } from '@/apis/user.api';
import { User } from '@/types/user';
import useSWR from 'swr';
import { showSuccessToast, showDangerToast } from '@/components/toastUtils';
import { handleErrors } from '@/lib/utils/errors';

interface UseUserFormProps {
  user?: User | null;
  onSuccess: (user?: User) => void;
  onCancel: () => void;
}

const tipoDocumentoOptions = [
  { name: "DNI", uid: "1" },
  { name: "Pasaporte", uid: "2" },
  { name: "Carnet de Extranjería", uid: "3" },
];

export function useUserForm({ user, onSuccess, onCancel }: UseUserFormProps) {
  const { data: session, status } = useSession();
  const [formData, setFormData] = useState<User>({
    email: user?.email || '',
    nombre: user?.nombre || '',
    apellido_paterno: user?.apellido_paterno || '',
    apellido_materno: user?.apellido_materno || '',
    is_active: user?.is_active !== undefined ? user.is_active : true,
    nro_documento: user?.nro_documento || '',
    tipo_documento_id: user?.tipo_documento_id || 1,
    roles: user?.roles || []
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const { data: userData, error: fetchError } = useSWR(
    user?.id && status === 'authenticated' 
      ? ['user', user.id, session?.user?.accessToken] 
      : null,
    ([, id, token]) => userApi.getUserById(token || '', id),
    {
      revalidateOnFocus: false, 
      revalidateOnMount: true, 
    }
  );

  useEffect(() => {
    if (userData) {
      console.log("🚀 ~ useEffect ~ userData:", userData)
      setFormData({
        email: userData.data.email || '',
        nombre: userData.data.nombre || '',
        apellido_paterno: userData.data.apellido_paterno || '',
        apellido_materno: userData.data.apellido_materno || '',
        is_active: userData.data.is_active || true,
        nro_documento: userData.data.nro_documento || '',
        tipo_documento_id: userData.data.tipo_documento_id || 1,
      });
    }
  }, [userData]);

  useEffect(() => {
    if (fetchError) {
      handleErrors(fetchError);
    }
  }, [fetchError]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  }, [errors]);

  const validateForm = useCallback(() => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.email?.trim()) newErrors.email = 'El email es requerido';
    if (!formData.nombre?.trim()) newErrors.nombre = 'El nombre es requerido';
    if (!formData.apellido_paterno?.trim()) newErrors.apellido_paterno = 'El apellido paterno es requerido';
    if (!formData.nro_documento?.trim()) newErrors.nro_documento = 'El número de documento es requerido';
    if (!formData.tipo_documento_id) newErrors.tipo_documento_id = 'El tipo de documento es requerido';

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'El formato del email no es válido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    if (!session?.user?.accessToken) {
      showDangerToast('Error al crear usuario', 'No se encontro el token de acceso');
      return;
    }

    setLoading(true);
    try {
      if (user?.id) { 
        const response = await userApi.updateUser(session.user.accessToken, user.id, formData);
        showSuccessToast('Usuario actualizado', response.message);
        onSuccess();
      } else {
        // For new users, we just pass the roles property as an empty array
        // The backend will handle the role assignment
        const userData = {
          ...formData,
          roles: []
        };
        const response = await userApi.createUser(session.user.accessToken, userData as Omit<User, 'id'>);
        showSuccessToast('Usuario creado', response.message);
        onSuccess();
      }
    } catch (error: unknown) {
      handleErrors(error);
    } finally {
      setLoading(false);
    }
  }, [formData, session, user, validateForm, onSuccess]);

  return {
    formData,
    loading,
    errors,
    tipoDocumentoOptions,
    handleChange,
    handleSubmit,
    validateForm,
    onCancel
  };
}
