import React from "react";
import { Button, Card, CardBody, Divider, Image } from "@heroui/react";
import { Icon } from "@iconify/react";
import { RegistrationConfirmationProps } from "@/lib/types/register";

export const RegistrationConfirmation: React.FC<RegistrationConfirmationProps> = ({
  formData,
  onPrevious,
}) => {
  const getDocumentTypeName = (type: string) => {
    const types: Record<string, string> = {
      dni: "DNI",
      passport: "Pasaporte",
      foreignId: "Carné de Extranjería",
    };
    return types[type] || type;
  };

  const getCycleName = (id: string) => {
    const cycles: Record<string, string> = {
      cycle1: "Ciclo I",
      cycle2: "Ciclo II",
      cycle3: "Ciclo III",
      cycle4: "Ciclo IV",
    };
    return cycles[id] || id;
  };

  const getAreaName = (id: string) => {
    const areas: Record<string, string> = {
      science: "Ciencias",
      humanities: "Humanidades",
      engineering: "Ingeniería",
      health: "Salud",
    };
    return areas[id] || id;
  };

  const getPaymentMethodName = (id: string) => {
    const methods: Record<string, string> = {
      credit: "Tarjeta de Crédito/Débito",
      bank: "Transferencia Bancaria",
      paypal: "PayPal",
    };
    return methods[id] || id;
  };

  // Generate a random registration ID
  const registrationId = React.useMemo(() => {
    return `REG-${Math.floor(100000 + Math.random() * 900000)}`;
  }, []);

  // Generate QR code data URL
  const qrCodeUrl = React.useMemo(() => {
    const qrData = JSON.stringify({
      registrationId,
      studentName: `${formData.firstName} ${formData.lastName} ${formData.secondLastName}`,
      documentType: getDocumentTypeName(formData.documentType),
      documentNumber: formData.documentNumber,
      cycle: getCycleName(formData.cycle),
      area: getAreaName(formData.area),
      timestamp: new Date().toISOString(),
    });
    console.log("🚀 ~ qrCodeUrl ~ qrData:", qrData)
    
    // Using HeroUI image service to generate a QR code-like image
    // In a real app, you would use a proper QR code library
    return `https://img.heroui.chat/image/ai?w=200&h=200&u=${encodeURIComponent(registrationId)}`;
  }, [formData, registrationId]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Confirmación de Registro</h2>
        <div className="flex gap-2">
          <Button
            variant="flat"
            startContent={<Icon icon="lucide:printer" width={16} />}
            onPress={handlePrint}
          >
            Imprimir
          </Button>
          <Button
            variant="flat"
            color="primary"
            startContent={<Icon icon="lucide:download" width={16} />}
          >
            Descargar PDF
          </Button>
        </div>
      </div>
      
      <Card>
        <CardBody className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-2/3 space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Información del Estudiante</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-default-500">Nombres</p>
                    <p className="font-medium">{formData.firstName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-default-500">Apellido Paterno</p>
                    <p className="font-medium">{formData.lastName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-default-500">Apellido Materno</p>
                    <p className="font-medium">{formData.secondLastName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-default-500">Documento</p>
                    <p className="font-medium">
                      {getDocumentTypeName(formData.documentType)}: {formData.documentNumber}
                    </p>
                  </div>
                </div>
              </div>
              
              <Divider />
              
              <div>
                <h3 className="text-lg font-medium mb-4">Información Académica</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-default-500">Ciclo</p>
                    <p className="font-medium">{getCycleName(formData.cycle)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-default-500">Área</p>
                    <p className="font-medium">{getAreaName(formData.area)}</p>
                  </div>
                </div>
              </div>
              
              <Divider />
              
              <div>
                <h3 className="text-lg font-medium mb-4">Información de Pago</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-default-500">Método de Pago</p>
                    <p className="font-medium">{getPaymentMethodName(formData.paymentMethod)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-default-500">Estado</p>
                    <p className="text-success font-medium">Completado</p>
                  </div>
                  <div>
                    <p className="text-sm text-default-500">ID de Registro</p>
                    <p className="font-medium">{registrationId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-default-500">Fecha</p>
                    <p className="font-medium">{new Date().toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="md:w-1/3 flex flex-col items-center">
              <div className="mb-4">
                {formData.photo ? (
                  <Image 
                    src={formData.photo} 
                    alt="Foto del estudiante" 
                    className="w-32 h-32 object-cover rounded-medium"
                  />
                ) : (
                  <div className="w-32 h-32 bg-default-100 rounded-medium flex items-center justify-center">
                    <Icon icon="lucide:user" width={48} className="text-default-400" />
                  </div>
                )}
              </div>
              
              <div className="text-center">
                <p className="text-sm text-default-500 mb-2">Código QR de Registro</p>
                <Image 
                  src={qrCodeUrl}
                  alt="QR Code" 
                  className="w-40 h-40 mx-auto border border-default-200 rounded-medium"
                />
                <p className="text-xs text-default-400 mt-2">
                  Escanee este código para verificar su registro
                </p>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
      
      <div className="flex justify-between">
        <Button 
          variant="flat" 
          onPress={onPrevious}
          startContent={<Icon icon="lucide:arrow-left" width={16} />}
        >
          Anterior
        </Button>
        <Button 
          color="success"
          startContent={<Icon icon="lucide:check" width={16} />}
        >
          Completar Registro
        </Button>
      </div>
    </div>
  );
};