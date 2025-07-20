'use client';

import React from 'react';
import { Spinner } from '@heroui/react';

interface LoadingAuthProps {
  message?: string;
}

/**
 * Componente de loading para estados de autenticación
 */
export function LoadingAuth({ 
  message = "Verificando permisos..." 
}: LoadingAuthProps) {
  return (
    <div className="flex items-center justify-center min-h-[200px] p-4">
      <div className="text-center">
        <Spinner 
          size="lg" 
          color="primary"
          className="mb-4"
        />
        <p className="text-gray-400 text-sm">
          {message}
        </p>
      </div>
    </div>
  );
}
