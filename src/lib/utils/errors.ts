import { AxiosError } from 'axios';
import { showDangerToast } from '@/components/toastUtils';
import { handleJWTExpiredLogout } from '@/lib/utils/authUtils';

// Definimos la interfaz para la respuesta de error de la API
interface ApiErrorResponse {
    errors?: string[] | string;
    message?: string;
}

// Tipos de errores específicos
export enum ErrorType {
    JWT_EXPIRED = 'JWT_EXPIRED',
    UNAUTHORIZED = 'UNAUTHORIZED',
    VALIDATION = 'VALIDATION',
    SERVER_ERROR = 'SERVER_ERROR',
    NETWORK_ERROR = 'NETWORK_ERROR',
    UNKNOWN = 'UNKNOWN'
}

// Interfaz para el resultado del manejo de errores
export interface ErrorHandlingResult {
    type: ErrorType;
    message: string;
    handled: boolean;
    shouldLogout: boolean;
    originalError: unknown;
}

// Función para detectar si es un error de JWT expirado
export const isJWTExpiredError = (error: AxiosError<ApiErrorResponse>): boolean => {
    if (error.response?.status !== 401) return false;
    
    const errorData = error.response.data;
    return (
        errorData?.errors === 'Not authorized, token failed' ||
        errorData?.message === 'Token expired' ||
        errorData?.errors === 'jwt expired' ||
        error.response.statusText === 'Unauthorized'
    );
};

// Función para manejar errores de JWT de forma específica
export const handleJWTError = async (error: AxiosError<ApiErrorResponse>): Promise<ErrorHandlingResult> => {
    const isExpired = isJWTExpiredError(error);
    
    if (isExpired) {
        // Usar función centralizada para logout por JWT expirado
        await handleJWTExpiredLogout({
            showToast: true,
            customMessage: 'Tu sesión ha expirado. Serás redirigido al login.'
        });
        
        return {
            type: ErrorType.JWT_EXPIRED,
            message: 'Sesión expirada',
            handled: true,
            shouldLogout: true,
            originalError: error
        };
    }
    
    return {
        type: ErrorType.UNAUTHORIZED,
        message: 'No autorizado',
        handled: false,
        shouldLogout: false,
        originalError: error
    };
};

// Función principal para manejar errores (mejorada)
export const handleErrors = (error: unknown, options?: {
    showToast?: boolean;
    customMessage?: string;
    skipJWTHandling?: boolean;
}): ErrorHandlingResult => {
    console.log("🚀 ~ error:", error)
    const { showToast = true, customMessage, skipJWTHandling = false } = options || {};
    
    if (error && typeof error === 'object' && 'isAxiosError' in error) {
        const axiosError = error as AxiosError<ApiErrorResponse>;
        
        // Manejar errores de JWT si no se especifica lo contrario
        if (!skipJWTHandling && axiosError.response?.status === 401) {
            const isExpired = isJWTExpiredError(axiosError);
            if (isExpired) {
                // Ejecutar la redirección inmediatamente
                handleJWTExpiredLogout({
                    showToast: showToast,
                    customMessage: customMessage || 'Tu sesión ha expirado. Serás redirigido al login.'
                });
                
                return {
                    type: ErrorType.JWT_EXPIRED,
                    message: 'Sesión expirada',
                    handled: true,
                    shouldLogout: true,
                    originalError: error
                };
            }
        }
        
        const responseData = axiosError.response?.data;
        let errorMessage = customMessage;
        let errorType = ErrorType.UNKNOWN;
        
        // Determinar tipo de error
        if (axiosError.response?.status === 401) {
            errorType = ErrorType.UNAUTHORIZED;
            errorMessage = errorMessage || 'No autorizado';
        } else if (axiosError.response?.status === 422 || axiosError.response?.status === 400) {
            errorType = ErrorType.VALIDATION;
        } else if (axiosError.response?.status && axiosError.response.status >= 500) {
            errorType = ErrorType.SERVER_ERROR;
            errorMessage = errorMessage || 'Error interno del servidor';
        } else if (axiosError.code === 'NETWORK_ERROR' || axiosError.code === 'ECONNABORTED') {
            errorType = ErrorType.NETWORK_ERROR;
            errorMessage = errorMessage || 'Error de conexión';
        }
        
        if (responseData && showToast) {
            // Si hay errores en formato { field: [messages] }
            if (responseData.errors) {
                if (Array.isArray(responseData.errors)) {
                    // Si errors es un array de strings
                    responseData.errors.forEach((errorMessage: string) => {
                        showDangerToast('Error', errorMessage);
                    });
                } else {
                    showDangerToast('Error', responseData.errors);
                }
            } 
            // Si hay un mensaje de error general
            else if (responseData.message) {
                showDangerToast('Error', responseData.message);
            }
            // Si tenemos un mensaje personalizado
            else if (errorMessage) {
                showDangerToast('Error', errorMessage);
            }
        } else if (showToast && errorMessage) {
            showDangerToast('Error', errorMessage);
        } else if (showToast) {
            showDangerToast('Error', 'Ocurrió un error inesperado');
        }
        
        return {
            type: errorType,
            message: errorMessage || 'Error desconocido',
            handled: true,
            shouldLogout: false,
            originalError: error
        };
    } else if (error instanceof Error) {
        if (showToast) {
            showDangerToast('Error', customMessage || error.message);
        }
        return {
            type: ErrorType.UNKNOWN,
            message: customMessage || error.message,
            handled: true,
            shouldLogout: false,
            originalError: error
        };
    } else {
        if (showToast) {
            showDangerToast('Error', customMessage || 'Ocurrió un error desconocido');
        }
        return {
            type: ErrorType.UNKNOWN,
            message: customMessage || 'Error desconocido',
            handled: true,
            shouldLogout: false,
            originalError: error
        };
    }
};

// Función de conveniencia para manejar errores en hooks con SWR
export const handleSWRError = (error: unknown): void => {
    const result = handleErrors(error);
    
    // Si es un error de JWT, no necesitamos hacer nada más
    // ya que handleErrors se encarga del logout
    if (result.type === ErrorType.JWT_EXPIRED) {
        return;
    }
    
    // Para otros errores, ya se mostró el toast en handleErrors
    console.error('SWR Error:', result);
};