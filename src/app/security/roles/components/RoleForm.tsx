"use client";

import { useState, useEffect } from 'react';

interface Role {
  id?: number;
  name: string;
  description: string;
}

interface RoleFormProps {
  cls: {
    glassCard: string;
    glassHeader: string;
  };
  role?: Role | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function RoleForm({ cls, role, onSuccess, onCancel }: RoleFormProps) {
  const [formData, setFormData] = useState<Role>({
    name: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  useEffect(() => {
    if (role) {
      setFormData({
        name: role.name,
        description: role.description
      });
    } else {
      setFormData({
        name: '',
        description: ''
      });
    }
  }, [role]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre del rol es requerido';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'La descripción del rol es requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const url = role 
        ? `/api/roles/editar-rol/${role.id}`
        : '/api/roles/crear-rol';
      
      const method = role ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        onSuccess();
      } else {
        const errorData = await response.json();
        console.error('Error saving role:', errorData);
        // Handle specific errors from backend
        if (errorData.errors) {
          setErrors(errorData.errors);
        } else if (errorData.message) {
          setErrors({ general: errorData.message });
        }
      }
    } catch (error) {
      console.error('Error:', error);
      setErrors({ general: 'Error de conexión. Intente nuevamente.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${cls.glassCard} rounded-xl p-6`}>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          {role ? 'Editar Rol' : 'Crear Nuevo Rol'}
        </h2>
        <p className="text-gray-600 mt-2">
          {role ? 'Modifica la información del rol' : 'Complete los datos para crear un nuevo rol'}
        </p>
      </div>

      {errors.general && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{errors.general}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Role Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nombre del Rol *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Ej: Administrador, Usuario, Editor..."
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>

        {/* Role Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Descripción *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            placeholder="Describe las responsabilidades y alcance de este rol..."
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 resize-none ${
              errors.description ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
        </div>

        {/* Role Preview */}
        {(formData.name || formData.description) && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-blue-800 mb-2">Vista Previa del Rol</h3>
            <div className="bg-white rounded-md p-3">
              <h4 className="font-medium text-gray-900">{formData.name || 'Nombre del rol'}</h4>
              <p className="text-sm text-gray-600 mt-1">{formData.description || 'Descripción del rol'}</p>
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {loading && (
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            {loading ? 'Guardando...' : (role ? 'Actualizar Rol' : 'Crear Rol')}
          </button>
        </div>
      </form>
    </div>
  );
}
