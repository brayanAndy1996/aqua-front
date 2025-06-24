import React from "react";
import { Button, Card, CardBody, Input, Radio, RadioGroup } from "@heroui/react";
import { Icon } from "@iconify/react";
interface FormData {
    paymentMethod: string;
    cardNumber: string;
    cardName: string;
    expiryDate: string;
    cvv: string;
  }
interface PaymentFormProps {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
  onNext: () => void;
  onPrevious: () => void;
}

export const PaymentForm: React.FC<PaymentFormProps> = ({
  formData,
  updateFormData,
  onNext,
  onPrevious,
}) => {
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const paymentMethods = [
    { 
      id: "credit", 
      name: "Tarjeta de Crédito/Débito", 
      icon: "lucide:credit-card",
      description: "Visa, Mastercard, American Express" 
    },
    { 
      id: "bank", 
      name: "Transferencia Bancaria", 
      icon: "lucide:building-bank",
      description: "Transferencia directa a nuestra cuenta" 
    },
    { 
      id: "paypal", 
      name: "PayPal", 
      icon: "logos:paypal",
      description: "Pago seguro con PayPal" 
    },
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.paymentMethod) {
      newErrors.paymentMethod = "Seleccione un método de pago";
    }
    
    if (formData.paymentMethod === "credit") {
      if (!formData.cardNumber) {
        newErrors.cardNumber = "Ingrese el número de tarjeta";
      } else if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, ''))) {
        newErrors.cardNumber = "El número de tarjeta debe tener 16 dígitos";
      }
      
      if (!formData.cardName) {
        newErrors.cardName = "Ingrese el nombre en la tarjeta";
      }
      
      if (!formData.expiryDate) {
        newErrors.expiryDate = "Ingrese la fecha de expiración";
      } else if (!/^\d{2}\/\d{2}$/.test(formData.expiryDate)) {
        newErrors.expiryDate = "Formato inválido (MM/YY)";
      }
      
      if (!formData.cvv) {
        newErrors.cvv = "Ingrese el CVV";
      } else if (!/^\d{3,4}$/.test(formData.cvv)) {
        newErrors.cvv = "El CVV debe tener 3 o 4 dígitos";
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onNext();
    }
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    
    if (v.length >= 3) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }
    
    return v;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold mb-6">Método de Pago</h2>
      
      <div>
        <h3 className="text-lg font-medium mb-4">Seleccione un método de pago</h3>
        {errors.paymentMethod && (
          <p className="text-danger text-sm mb-2">{errors.paymentMethod}</p>
        )}
        <RadioGroup
          value={formData.paymentMethod}
          onValueChange={(value) => updateFormData({ paymentMethod: value })}
          orientation="vertical"
          className="gap-4"
        >
          {paymentMethods.map((method) => (
            <Radio
              key={method.id}
              value={method.id}
              className="p-0"
              classNames={{
                base: "m-0"
              }}
            >
              <Card
                isPressable
                className={`w-full ${
                  formData.paymentMethod === method.id ? "border-2 border-primary" : ""
                }`}
              >
                <CardBody className="p-4">
                  <div className="flex items-center">
                    <div className="mr-4">
                      <Icon icon={method.icon} width={24} />
                    </div>
                    <div>
                      <h4 className="font-medium">{method.name}</h4>
                      <p className="text-sm text-default-500">{method.description}</p>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Radio>
          ))}
        </RadioGroup>
      </div>
      
      {formData.paymentMethod === "credit" && (
        <div className="mt-6 space-y-4 p-4 bg-default-50 rounded-medium">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Input
                label="Número de Tarjeta"
                placeholder="1234 5678 9012 3456"
                value={formData.cardNumber}
                onValueChange={(value) => updateFormData({ cardNumber: formatCardNumber(value) })}
                startContent={<Icon icon="lucide:credit-card" className="text-default-400" />}
                isInvalid={!!errors.cardNumber}
                errorMessage={errors.cardNumber}
              />
            </div>
            
            <div className="md:col-span-2">
              <Input
                label="Nombre en la Tarjeta"
                placeholder="NOMBRE APELLIDO"
                value={formData.cardName}
                onValueChange={(value) => updateFormData({ cardName: value.toUpperCase() })}
                isInvalid={!!errors.cardName}
                errorMessage={errors.cardName}
              />
            </div>
            
            <div>
              <Input
                label="Fecha de Expiración"
                placeholder="MM/YY"
                value={formData.expiryDate}
                onValueChange={(value) => {
                  if (value.length <= 5) {
                    updateFormData({ expiryDate: formatExpiryDate(value) });
                  }
                }}
                isInvalid={!!errors.expiryDate}
                errorMessage={errors.expiryDate}
              />
            </div>
            
            <div>
              <Input
                label="CVV"
                placeholder="123"
                value={formData.cvv}
                onValueChange={(value) => {
                  if (value.length <= 4 && /^\d*$/.test(value)) {
                    updateFormData({ cvv: value });
                  }
                }}
                isInvalid={!!errors.cvv}
                errorMessage={errors.cvv}
              />
            </div>
          </div>
        </div>
      )}
      
      {formData.paymentMethod === "bank" && (
        <div className="mt-6 p-4 bg-default-50 rounded-medium">
          <h4 className="font-medium mb-2">Instrucciones para Transferencia Bancaria</h4>
          <ul className="list-disc list-inside space-y-2 text-default-700">
            <li>Banco: Banco Nacional Educativo</li>
            <li>Cuenta: 0012-3456-7890-1234</li>
            <li>Titular: Instituto Educativo</li>
            <li>Concepto: Matrícula + Nombre del Estudiante</li>
          </ul>
          <p className="mt-4 text-sm text-default-500">
            Una vez realizada la transferencia, recibirá un correo electrónico de confirmación.
          </p>
        </div>
      )}
      
      {formData.paymentMethod === "paypal" && (
        <div className="mt-6 p-4 bg-default-50 rounded-medium text-center">
          <Icon icon="logos:paypal" width={80} className="mx-auto mb-4" />
          <p className="text-default-700">
            Será redirigido a PayPal para completar el pago de forma segura.
          </p>
        </div>
      )}
      
      <div className="flex justify-between mt-8">
        <Button 
          variant="flat" 
          onPress={onPrevious}
          startContent={<Icon icon="lucide:arrow-left" width={16} />}
        >
          Anterior
        </Button>
        <Button 
          color="primary" 
          type="submit"
          endContent={<Icon icon="lucide:arrow-right" width={16} />}
        >
          Finalizar Registro
        </Button>
      </div>
    </form>
  );
};