import { AxiosError } from 'axios';
import { showDangerToast } from '@/components/toastUtils';

// Definimos la interfaz para la respuesta de error de la API
interface ApiErrorResponse {
    errors?: string[] | string
    message?: string;
}

export const handleErrors = (error: unknown): void => {
    if (error && typeof error === 'object' && 'isAxiosError' in error) {
        const axiosError = error as AxiosError<ApiErrorResponse>;
        const responseData = axiosError.response?.data;
        
        if (responseData) {
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
        } else {
            showDangerToast('Error', 'Ocurrió un error inesperado');
        }
    } else if (error instanceof Error) {
        showDangerToast('Error', error.message);
    } else {
        showDangerToast('Error', 'Ocurrió un error desconocido');
    }
};