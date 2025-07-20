'use client';

import React from 'react';
import { RoleGuard } from '@/components/auth/RoleGuard';
import { ConditionalRender } from '@/components/auth/ConditionalRender';
import { UnauthorizedAccess } from '@/components/auth/UnauthorizedAccess';
import { useRoles } from '@/hooks/useRoles';
import { Card, CardBody, Tabs, Tab } from '@heroui/react';
import { BarChart3, TrendingUp, Users, ShoppingCart } from 'lucide-react';

/**
 * Ejemplo de página de reportes protegida por roles
 * Solo Administrador y Entrenador pueden acceder
 */
const ProtectedReportesPage = () => {
  const { userRoles, checkRole } = useRoles();

  return (
    <RoleGuard 
      allowedRoles={['Administrador', 'Entrenador']}
      fallback={
        <UnauthorizedAccess 
          message="Solo administradores y entrenadores pueden acceder al módulo de reportes" 
        />
      }
    >
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 p-6">
        <div className="max-w-7xl mx-auto">
          
          {/* Header con información de rol */}
          <ConditionalRender
            condition={{ roles: ['Administrador'] }}
            fallback={
              <div className="mb-6 p-4 bg-blue-500/20 backdrop-blur-md rounded-lg border border-blue-300/30">
                <p className="text-blue-800 text-sm">
                  📊 Accediendo como Entrenador - Vista limitada de reportes
                </p>
              </div>
            }
          >
            <div className="mb-6 p-4 bg-green-500/20 backdrop-blur-md rounded-lg border border-green-300/30">
              <p className="text-green-800 text-sm">
                👑 Accediendo como Administrador - Acceso completo a todos los reportes
              </p>
            </div>
          </ConditionalRender>

          {/* Título */}
          <Card className="mb-8 bg-white/10 backdrop-blur-md border border-white/20">
            <CardBody className="p-6">
              <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center">
                <BarChart3 className="mr-3 text-blue-600" />
                Reportes de Productos
              </h1>
              <p className="text-gray-600">
                Análisis y estadísticas de ventas y compras de productos
              </p>
            </CardBody>
          </Card>

          {/* Métricas principales */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-white/10 backdrop-blur-md border border-white/20">
              <CardBody className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Ventas Totales</p>
                    <p className="text-2xl font-bold text-green-600">$125,430</p>
                  </div>
                  <TrendingUp className="text-green-500 w-8 h-8" />
                </div>
              </CardBody>
            </Card>

            <Card className="bg-white/10 backdrop-blur-md border border-white/20">
              <CardBody className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Productos Vendidos</p>
                    <p className="text-2xl font-bold text-blue-600">1,234</p>
                  </div>
                  <ShoppingCart className="text-blue-500 w-8 h-8" />
                </div>
              </CardBody>
            </Card>

            {/* Solo administradores pueden ver métricas financieras detalladas */}
            <ConditionalRender
              condition={{ roles: ['Administrador'] }}
              fallback={
                <Card className="bg-gray-100/50 backdrop-blur-md border border-gray-300/20">
                  <CardBody className="p-4 text-center">
                    <p className="text-sm text-gray-500">Acceso restringido</p>
                    <p className="text-xs text-gray-400">Solo administradores</p>
                  </CardBody>
                </Card>
              }
            >
              <Card className="bg-white/10 backdrop-blur-md border border-white/20">
                <CardBody className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Ganancia Neta</p>
                      <p className="text-2xl font-bold text-purple-600">$45,230</p>
                    </div>
                    <TrendingUp className="text-purple-500 w-8 h-8" />
                  </div>
                </CardBody>
              </Card>
            </ConditionalRender>

            <Card className="bg-white/10 backdrop-blur-md border border-white/20">
              <CardBody className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Clientes Activos</p>
                    <p className="text-2xl font-bold text-orange-600">89</p>
                  </div>
                  <Users className="text-orange-500 w-8 h-8" />
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Tabs de reportes */}
          <Card className="bg-white/10 backdrop-blur-md border border-white/20">
            <CardBody className="p-6">
              <Tabs aria-label="Reportes" className="w-full">
                <Tab key="ventas" title="Reportes de Ventas">
                  <div className="mt-4">
                    <h3 className="text-lg font-semibold mb-4">Análisis de Ventas</h3>
                    <p className="text-gray-600 mb-4">
                      Aquí se mostrarían los gráficos y tablas de ventas...
                    </p>
                    
                    {/* Contenido específico por rol */}
                    <ConditionalRender
                      condition={{ roles: ['Administrador'] }}
                      fallback={
                        <div className="p-4 bg-blue-50/50 rounded-lg">
                          <p className="text-sm text-blue-700">
                            Como entrenador, puedes ver las estadísticas básicas de ventas 
                            para entender el rendimiento de los productos relacionados con el entrenamiento.
                          </p>
                        </div>
                      }
                    >
                      <div className="p-4 bg-green-50/50 rounded-lg">
                        <p className="text-sm text-green-700">
                          Como administrador, tienes acceso completo a todos los reportes financieros, 
                          incluyendo márgenes de ganancia, costos y análisis detallados.
                        </p>
                      </div>
                    </ConditionalRender>
                  </div>
                </Tab>

                <Tab key="compras" title="Reportes de Compras">
                  <div className="mt-4">
                    <h3 className="text-lg font-semibold mb-4">Análisis de Compras</h3>
                    <p className="text-gray-600 mb-4">
                      Aquí se mostrarían los gráficos y tablas de compras...
                    </p>
                  </div>
                </Tab>

                {/* Tab solo para administradores */}
                {checkRole.isAdmin() && (
                  <Tab key="financiero" title="Reporte Financiero">
                    <div className="mt-4">
                      <h3 className="text-lg font-semibold mb-4">Análisis Financiero Completo</h3>
                      <div className="p-4 bg-yellow-50/50 rounded-lg">
                        <p className="text-sm text-yellow-700">
                          🔒 Este contenido solo está disponible para administradores.
                          Incluye análisis de rentabilidad, flujo de caja y proyecciones.
                        </p>
                      </div>
                    </div>
                  </Tab>
                )}
              </Tabs>
            </CardBody>
          </Card>

          {/* Footer con información del usuario actual */}
          <div className="mt-8 text-center text-sm text-gray-500">
            <p>
              Conectado con roles: {userRoles.join(', ')} | 
              Nivel de acceso: {checkRole.isAdmin() ? 'Completo' : 'Limitado'}
            </p>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
};

export default ProtectedReportesPage;
