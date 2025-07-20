'use client';

import React from 'react';
import { Card, CardBody } from '@heroui/react';
import { ShieldX, Lock } from 'lucide-react';

interface UnauthorizedAccessProps {
  message?: string;
  showIcon?: boolean;
}

/**
 * Componente que se muestra cuando el usuario no tiene permisos
 */
export function UnauthorizedAccess({ 
  message = "No tienes permisos para acceder a este contenido",
  showIcon = true 
}: UnauthorizedAccessProps) {
  return (
    <div className="flex items-center justify-center min-h-[400px] p-4">
      <Card className="max-w-md w-full bg-white/10 backdrop-blur-md border border-white/20">
        <CardBody className="text-center p-8">
          {showIcon && (
            <div className="flex justify-center mb-4">
              <div className="p-3 rounded-full bg-red-500/20">
                <ShieldX className="w-8 h-8 text-red-400" />
              </div>
            </div>
          )}
          
          <h3 className="text-lg font-semibold text-white mb-2">
            Acceso Restringido
          </h3>
          
          <p className="text-gray-300 text-sm mb-4">
            {message}
          </p>
          
          <div className="flex items-center justify-center text-xs text-gray-400">
            <Lock className="w-3 h-3 mr-1" />
            Contacta al administrador si necesitas acceso
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
