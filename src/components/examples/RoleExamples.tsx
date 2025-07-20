'use client';

import React from 'react';
import { Card, CardBody } from '@heroui/react';
import { withRoleProtection, withAdminOnly, withProductsAccess, withReportsAccess } from '@/hocs/withRoleProtection';
import { Shield, Package, BarChart3, Settings } from 'lucide-react';

// Componentes de ejemplo simples
const AdminPanel = () => (
  <Card className="bg-red-500/20 backdrop-blur-md border border-red-300/30">
    <CardBody className="p-4 text-center">
      <Shield className="w-8 h-8 mx-auto mb-2 text-red-600" />
      <h3 className="font-semibold text-red-800">Panel de Administración</h3>
      <p className="text-sm text-red-700">Solo administradores pueden ver esto</p>
    </CardBody>
  </Card>
);

const ProductsModule = () => (
  <Card className="bg-blue-500/20 backdrop-blur-md border border-blue-300/30">
    <CardBody className="p-4 text-center">
      <Package className="w-8 h-8 mx-auto mb-2 text-blue-600" />
      <h3 className="font-semibold text-blue-800">Módulo de Productos</h3>
      <p className="text-sm text-blue-700">Administradores y Asistentes</p>
    </CardBody>
  </Card>
);

const ReportsModule = () => (
  <Card className="bg-green-500/20 backdrop-blur-md border border-green-300/30">
    <CardBody className="p-4 text-center">
      <BarChart3 className="w-8 h-8 mx-auto mb-2 text-green-600" />
      <h3 className="font-semibold text-green-800">Módulo de Reportes</h3>
      <p className="text-sm text-green-700">Administradores y Entrenadores</p>
    </CardBody>
  </Card>
);

const SettingsPanel = () => (
  <Card className="bg-purple-500/20 backdrop-blur-md border border-purple-300/30">
    <CardBody className="p-4 text-center">
      <Settings className="w-8 h-8 mx-auto mb-2 text-purple-600" />
      <h3 className="font-semibold text-purple-800">Configuración</h3>
      <p className="text-sm text-purple-700">Múltiples roles permitidos</p>
    </CardBody>
  </Card>
);

// Aplicar HOCs a los componentes
const ProtectedAdminPanel = withAdminOnly(AdminPanel);
const ProtectedProductsModule = withProductsAccess(ProductsModule);
const ProtectedReportsModule = withReportsAccess(ReportsModule);
const ProtectedSettingsPanel = withRoleProtection(SettingsPanel, ['Administrador', 'Entrenador', 'Asistente']);

/**
 * Componente que demuestra el uso de HOCs para protección por roles
 */
export function RoleExamples() {
  return (
    <div className="space-y-8">
      <Card className="bg-white/10 backdrop-blur-md border border-white/20">
        <CardBody className="p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Ejemplos de Protección por Roles
          </h2>
          <p className="text-gray-600 mb-6">
            Los siguientes componentes se muestran u ocultan según los roles del usuario actual:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Panel de Administración - Solo Administradores */}
            <ProtectedAdminPanel />

            {/* Módulo de Productos - Administradores y Asistentes */}
            <ProtectedProductsModule />

            {/* Módulo de Reportes - Administradores y Entrenadores */}
            <ProtectedReportsModule />

            {/* Panel de Configuración - Múltiples roles */}
            <ProtectedSettingsPanel />
          </div>

          <div className="mt-8 p-4 bg-gray-100/50 rounded-lg">
            <h3 className="font-semibold text-gray-800 mb-2">Cómo funciona:</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• <strong>Administrador:</strong> Ve todos los componentes</li>
              <li>• <strong>Entrenador:</strong> Ve Reportes y Configuración</li>
              <li>• <strong>Asistente:</strong> Ve Productos y Configuración</li>
              <li>• <strong>Padre/Estudiante:</strong> No ve ningún componente administrativo</li>
            </ul>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
