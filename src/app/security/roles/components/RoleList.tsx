"use client";

import { useState, useEffect } from 'react';
import { roleApi } from '@/apis/role.api';
import { Role } from '@/types/role';

interface RoleListProps {
  cls: {
    glassCard: string;
    glassHeader: string;
  };
  onEditRole: (role: Role) => void;
}

export default function RoleList({ cls, onEditRole }: RoleListProps) {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [rolesPerPage] = useState(10);

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      setLoading(true);
      const data = await roleApi.getRoles();
      setRoles(data);
    } catch (error) {
      console.error('Error fetching roles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRole = async (roleId: number) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este rol?')) return;
    
    try {
      await roleApi.deleteRole(roleId);
      setRoles(roles.filter(role => role.id !== roleId));
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const filteredRoles = roles.filter(role =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const indexOfLastRole = currentPage * rolesPerPage;
  const indexOfFirstRole = indexOfLastRole - rolesPerPage;
  const currentRoles = filteredRoles.slice(indexOfFirstRole, indexOfLastRole);
  const totalPages = Math.ceil(filteredRoles.length / rolesPerPage);

  if (loading) {
    return (
      <div className={`${cls.glassCard} rounded-xl p-6`}>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${cls.glassCard} rounded-xl p-6`}>
      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar roles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Roles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentRoles.map((role) => (
          <div key={role.id} className="bg-white/80 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{role.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{role.description}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => onEditRole(role)}
                  className="text-blue-600 hover:text-blue-800 p-1 rounded-md hover:bg-blue-100 transition-colors"
                  title="Editar rol"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  onClick={() => handleDeleteRole(role.id)}
                  className="text-red-600 hover:text-red-800 p-1 rounded-md hover:bg-red-100 transition-colors"
                  title="Eliminar rol"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="text-xs text-gray-500">
              <p>Creado: {new Date(role.created_at).toLocaleDateString()}</p>
              {role.updated_at !== role.created_at && (
                <p>Actualizado: {new Date(role.updated_at).toLocaleDateString()}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {currentRoles.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
          </div>
          <p className="text-gray-500">
            {searchTerm ? 'No se encontraron roles que coincidan con la búsqueda' : 'No hay roles registrados'}
          </p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex justify-between items-center">
          <div className="text-sm text-gray-700">
            Mostrando {indexOfFirstRole + 1} a {Math.min(indexOfLastRole, filteredRoles.length)} de {filteredRoles.length} roles
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm bg-white/80 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Anterior
            </button>
            <span className="px-3 py-1 text-sm bg-blue-500 text-white rounded-md">
              {currentPage} de {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-sm bg-white/80 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
