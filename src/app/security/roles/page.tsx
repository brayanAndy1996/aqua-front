"use client";

import { useState } from 'react';
import RoleList from './components/RoleList';
import RoleForm from './components/RoleForm';
import RolePermissionAssignment from './components/RolePermissionAssignment';

interface Role {
  id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export default function RolesPage() {
  const [activeTab, setActiveTab] = useState('list');
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  const tabs = [
    { id: 'list', name: 'Lista de Roles', icon: '🏷️' },
    { id: 'create', name: 'Crear Rol', icon: '➕' },
    { id: 'permissions', name: 'Asignar Permisos', icon: '🔑' }
  ];

  const cls = {
    glassCard: "bg-white/70 backdrop-blur-lg shadow-lg border border-white/20",
    glassHeader: "bg-white/70 backdrop-blur-md shadow-sm border-b border-white/30",
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-cover bg-center py-6" 
      style={{ backgroundImage: 'url(https://i.pinimg.com/736x/19/0c/ec/190cecae1d39f35df5e3965723d17873.jpg)' }}
    >
      <div className="w-11/12 max-w-7xl bg-white/60 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className={`${cls.glassHeader} p-6`}>
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Gestión de Roles</h1>
          
          {/* Tabs */}
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'bg-white/50 text-gray-700 hover:bg-white/70'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'list' && (
            <RoleList 
              cls={cls} 
              onEditRole={(role) => {
                setSelectedRole(role);
                setActiveTab('create');
              }}
            />
          )}
          {activeTab === 'create' && (
            <RoleForm 
              cls={cls} 
              role={selectedRole}
              onSuccess={() => {
                setActiveTab('list');
                setSelectedRole(null);
              }}
              onCancel={() => {
                setActiveTab('list');
                setSelectedRole(null);
              }}
            />
          )}
          {activeTab === 'permissions' && (
            <RolePermissionAssignment cls={cls} />
          )}
        </div>
      </div>
    </div>
  );
}
