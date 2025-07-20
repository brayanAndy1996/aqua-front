'use client';

import React from 'react';
import { Card, CardBody } from '@heroui/react';
import styles from '@/app/styles/glassStyles.module.css';
import { RoleGuard } from '@/components/auth/RoleGuard';
import { ConditionalRender } from '@/components/auth/ConditionalRender';
import { UnauthorizedAccess } from '@/components/auth/UnauthorizedAccess';
import { Package, ShoppingCart, Users, TrendingUp } from 'lucide-react';

/**
 * Ejemplo de página de ventas protegida por roles
 * Solo Administrador y Asistente pueden acceder
 */
const ProtectedVentasPage = () => {

  return (
    <RoleGuard 
      allowedRoles={['Administrador', 'Asistente']}
      fallback={
        <UnauthorizedAccess 
          message="Solo administradores y asistentes pueden acceder al módulo de ventas" 
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
                  🛡️ Accediendo como Asistente - Permisos limitados para ventas
                </p>
              </div>
            }
          >
            <div className="mb-6 p-4 bg-green-500/20 backdrop-blur-md rounded-lg border border-green-300/30">
              <p className="text-green-800 text-sm">
                👑 Accediendo como Administrador - Acceso completo al sistema
              </p>
            </div>
          </ConditionalRender>

          {/* Título */}
          <div className={`${styles.glassCard} mb-8`}>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              🏊‍♂️ Ventas de Productos - Escuela de Natación
            </h1>
            <p className="text-gray-600">
              Gestiona las ventas de productos para estudiantes y padres
            </p>
          </div>

          {/* Contenido principal - Ejemplo de módulo de productos */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Sección de productos */}
            <div className="lg:col-span-2">
              <Card className={styles.glassCard}>
                <CardBody className="p-6">
                  <h2 className="text-xl font-semibold mb-4 flex items-center">
                    <Package className="mr-2 text-blue-600" />
                    Catálogo de Productos
                  </h2>
                  <p className="text-gray-600 mb-4">
                    Aquí se mostraría el grid de productos disponibles para venta.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-blue-50/50 rounded-lg">
                      <h3 className="font-medium">Productos de Natación</h3>
                      <p className="text-sm text-gray-600">Goggles, trajes de baño, accesorios</p>
                    </div>
                    <div className="p-4 bg-green-50/50 rounded-lg">
                      <h3 className="font-medium">Material de Entrenamiento</h3>
                      <p className="text-sm text-gray-600">Tablas, pull buoys, aletas</p>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </div>

            {/* Sección de estadísticas */}
            <div className="lg:col-span-1">
              <Card className={styles.glassCard}>
                <CardBody className="p-6">
                  <h2 className="text-xl font-semibold mb-4 flex items-center">
                    <ShoppingCart className="mr-2 text-green-600" />
                    Estadísticas de Ventas
                  </h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-green-50/50 rounded-lg">
                      <div className="flex items-center">
                        <TrendingUp className="w-5 h-5 text-green-600 mr-2" />
                        <span className="text-sm">Ventas del día</span>
                      </div>
                      <span className="font-semibold text-green-600">$1,250</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-blue-50/50 rounded-lg">
                      <div className="flex items-center">
                        <Users className="w-5 h-5 text-blue-600 mr-2" />
                        <span className="text-sm">Clientes atendidos</span>
                      </div>
                      <span className="font-semibold text-blue-600">23</span>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
};

export default ProtectedVentasPage;
