import { useState, useCallback } from 'react';
import { FormDataRegister } from '@/types/register';
import { ValidationErrors } from '@/types/register';


export function useFormValidation() {
  const [errors, setErrors] = useState<ValidationErrors>({});

  const validateDocumentType = useCallback((documentType: string) => {
    if (!documentType) {
      return 'Seleccione un tipo de documento';
    }
    return '';
  }, []);

  const validateDocumentNumber = useCallback((documentNumber: string) => {
    if (!documentNumber) {
      return 'Ingrese su número de documento';
    }
    if (!/^[0-9]+$/.test(documentNumber)) {
      return 'El número de documento debe contener solo dígitos';
    }
    return '';
  }, []);

  const validateName = useCallback((name: string, fieldName: keyof FormDataRegister) => {
    if (!name.trim()) {
      return `Ingrese su ${fieldName === 'firstName' ? 'nombres' : 'apellido'}`;
    }
    return '';
  }, []);

  const validatePhoto = useCallback((photo: string) => {
    if (!photo) {
      return 'Suba una foto';
    }
    return '';
  }, []);

  const validateCycle = useCallback((cycle: string) => {
    if (!cycle) {
      return 'Seleccione un ciclo';
    }
    return '';
  }, []);

  const validateArea = useCallback((area: string) => {
    if (!area) {
      return 'Seleccione un área';
    }
    return '';
  }, []);

  const validatePaymentMethod = useCallback((paymentMethod: string) => {
    if (!paymentMethod) {
      return 'Seleccione un método de pago';
    }
    return '';
  }, []);

  const validateCardNumber = useCallback((cardNumber: string) => {
    if (!cardNumber) {
      return 'Ingrese su número de tarjeta';
    }
    if (!/^\d{16}$/.test(cardNumber)) {
      return 'El número de tarjeta debe tener 16 dígitos';
    }
    return '';
  }, []);

  const validateCardName = useCallback((cardName: string) => {
    if (!cardName.trim()) {
      return 'Ingrese el nombre del titular';
    }
    return '';
  }, []);

  const validateExpiryDate = useCallback((expiryDate: string) => {
    if (!expiryDate) {
      return 'Ingrese la fecha de vencimiento';
    }
    return '';
  }, []);

  const validateCvv = useCallback((cvv: string) => {
    if (!cvv) {
      return 'Ingrese el CVV';
    }
    if (!/^\d{3}$/.test(cvv)) {
      return 'El CVV debe tener 3 dígitos';
    }
    return '';
  }, []);

  const validateField = useCallback((fieldName: keyof FormDataRegister, value: string) => {
    const validators = {
      documentType: validateDocumentType,
      documentNumber: validateDocumentNumber,
      firstName: (v: string) => validateName(v, 'firstName'),
      lastName: (v: string) => validateName(v, 'lastName'),
      secondLastName: (v: string) => validateName(v, 'secondLastName'),
      photo: validatePhoto,
      cycle: validateCycle,
      area: validateArea,
      paymentMethod: validatePaymentMethod,
      cardNumber: validateCardNumber,
      cardName: validateCardName,
      expiryDate: validateExpiryDate,
      cvv: validateCvv,
    };

    const error = validators[fieldName](value);
    setErrors(prev => ({
      ...prev,
      [fieldName]: error
    }));
    return error;
  }, [
    validateDocumentType,
    validateDocumentNumber,
    validateName,
    validatePhoto,
    validateCycle,
    validateArea,
    validatePaymentMethod,
    validateCardNumber,
    validateCardName,
    validateExpiryDate,
    validateCvv
  ]);

  const validateAll = useCallback((data: FormDataRegister) => {
    const newErrors: ValidationErrors = {};
    
    Object.entries(data).forEach(([key, value]) => {
      const fieldName = key as keyof FormDataRegister;
      const error = validateField(fieldName, value as string);
      if (error) {
        newErrors[fieldName] = error;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [validateField]);

  return {
    errors,
    validateField,
    validateAll
  };
}
