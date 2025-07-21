'use client';

import { useState } from 'react';
import { Button, Card, CardBody, CardHeader, Divider, Code } from '@heroui/react';
import { handleJWTExpiredLogout } from '@/lib/utils/authUtils';
import { apiGet } from '@/lib/api/apiWrapper';

/**
 * Componente de prueba para verificar el manejo de errores JWT y redirección automática
 * 
 * Este componente es solo para testing y desarrollo. NO incluir en producción.
 */
export const JWTRedirectTest = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [testResult, setTestResult] = useState<string>('');

  // Función para simular logout manual
  const handleManualLogout = async () => {
    setIsLoading(true);
    setTestResult('Iniciando logout manual...');
    
    try {
      await handleJWTExpiredLogout({
        showToast: true,
        customMessage: 'Logout manual ejecutado - Redirigiendo a /auth/login'
      });
      setTestResult('✅ Logout ejecutado correctamente');
    } catch (error) {
      setTestResult(`❌ Error en logout: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Función para simular logout sin toast
  const handleSilentLogout = async () => {
    setIsLoading(true);
    setTestResult('Iniciando logout silencioso...');
    
    try {
      await handleJWTExpiredLogout({
        showToast: false,
        immediate: true
      });
      setTestResult('✅ Logout silencioso ejecutado');
    } catch (error) {
      setTestResult(`❌ Error en logout silencioso: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Función para simular una llamada API que podría fallar con JWT
  const handleTestAPICall = async () => {
    setIsLoading(true);
    setTestResult('Probando llamada API...');
    
    try {
      // Esta llamada usará el interceptor automáticamente
      const response = await apiGet('/test-endpoint-that-might-fail');
      setTestResult('✅ API call exitosa: ' + JSON.stringify(response));
    } catch (error: unknown) {
      const errorObj = error as { type?: string; message?: string };
      if (errorObj.type === 'JWT_EXPIRED') {
        setTestResult('✅ Error JWT detectado y manejado automáticamente');
      } else {
        setTestResult(`❌ Error en API call: ${errorObj.message || String(error)}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Función para simular error JWT con callback personalizado
  const handleCustomCallbackLogout = async () => {
    setIsLoading(true);
    setTestResult('Iniciando logout con callback personalizado...');
    
    try {
      await handleJWTExpiredLogout({
        showToast: true,
        customMessage: 'Redirigiendo a página personalizada...',
        customCallbackUrl: '/auth/login?from=test',
        delay: 1000 // 1 segundo de delay
      });
      setTestResult('✅ Logout con callback personalizado ejecutado');
    } catch (error) {
      setTestResult(`❌ Error en logout personalizado: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader className="flex gap-3">
        <div className="flex flex-col">
          <p className="text-md font-semibold">🧪 JWT Redirect Test</p>
          <p className="text-small text-default-500">
            Componente de prueba para verificar el manejo automático de JWT expirado
          </p>
        </div>
      </CardHeader>
      
      <Divider />
      
      <CardBody className="gap-4">
        <div className="flex flex-col gap-2">
          <h4 className="text-lg font-semibold">Pruebas de Logout</h4>
          <p className="text-sm text-default-600">
            Estas pruebas simularán diferentes escenarios de JWT expirado y verificarán 
            que la redirección a <Code>/auth/login</Code> funcione correctamente.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Button
            color="primary"
            variant="flat"
            onPress={handleManualLogout}
            isLoading={isLoading}
            className="h-auto p-4 flex-col items-start"
          >
            <span className="font-semibold">Logout Manual</span>
            <span className="text-xs opacity-70">Con toast y delay de 2s</span>
          </Button>

          <Button
            color="secondary"
            variant="flat"
            onPress={handleSilentLogout}
            isLoading={isLoading}
            className="h-auto p-4 flex-col items-start"
          >
            <span className="font-semibold">Logout Silencioso</span>
            <span className="text-xs opacity-70">Sin toast, inmediato</span>
          </Button>

          <Button
            color="warning"
            variant="flat"
            onPress={handleTestAPICall}
            isLoading={isLoading}
            className="h-auto p-4 flex-col items-start"
          >
            <span className="font-semibold">Test API Call</span>
            <span className="text-xs opacity-70">Simula error JWT en API</span>
          </Button>

          <Button
            color="success"
            variant="flat"
            onPress={handleCustomCallbackLogout}
            isLoading={isLoading}
            className="h-auto p-4 flex-col items-start"
          >
            <span className="font-semibold">Callback Personalizado</span>
            <span className="text-xs opacity-70">Con URL personalizada</span>
          </Button>
        </div>

        {testResult && (
          <div className="mt-4">
            <h5 className="font-semibold mb-2">Resultado de la Prueba:</h5>
            <Code className="w-full p-3 text-sm whitespace-pre-wrap">
              {testResult}
            </Code>
          </div>
        )}

        <Divider />

        <div className="text-xs text-default-500 space-y-1">
          <p><strong>Nota:</strong> Este componente es solo para testing.</p>
          <p><strong>Comportamiento esperado:</strong></p>
          <ul className="list-disc list-inside ml-4 space-y-1">
            <li>Mostrar toast de &quot;Sesión Expirada&quot;</li>
            <li>Esperar 2 segundos (o tiempo personalizado)</li>
            <li>Redirigir automáticamente a <Code>/auth/login</Code></li>
            <li>Limpiar la sesión de NextAuth</li>
          </ul>
        </div>
      </CardBody>
    </Card>
  );
};

export default JWTRedirectTest;
