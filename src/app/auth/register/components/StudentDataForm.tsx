import React from "react";
import { Button, Input, Select, SelectItem, Image } from "@heroui/react";
import { Icon } from "@iconify/react";
import { StudentDataFormProps } from "@/lib/types/register";

import { useFormValidation } from '@/hooks/useFormValidation';

export const StudentDataForm: React.FC<StudentDataFormProps> = ({
  formData,
  updateFormData,
  onNext,
}) => {
  const { errors, validateField } = useFormValidation();
  const [photoPreview, setPhotoPreview] = React.useState<string | null>(formData.photo || null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const documentTypes = [
    { key: "dni", label: "DNI" },
    { key: "passport", label: "Pasaporte" },
    { key: "foreignId", label: "Carné de Extranjería" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateField('documentType', formData.documentType) ||
        validateField('documentNumber', formData.documentNumber) ||
        validateField('firstName', formData.firstName) ||
        validateField('lastName', formData.lastName) ||
        validateField('secondLastName', formData.secondLastName) ||
        validateField('photo', formData.photo)) {
      return;
    }
    onNext();
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPhotoPreview(result);
        updateFormData({ photo: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold mb-6">Datos del Estudiante</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Select
            label="Tipo de Documento"
            placeholder="Seleccione un tipo"
            selectedKeys={formData.documentType ? [formData.documentType] : []}
            onChange={(e) => updateFormData({ documentType: e.target.value })}
            isInvalid={!!errors.documentType}
            errorMessage={errors.documentType}
          >
            {documentTypes.map((type: { key: string; label: string }) => (
              <SelectItem key={type.key} textValue={type.label}>
                {type.label}
              </SelectItem>
            ))}
          </Select>
        </div>
        
        <div>
          <Input
            type="text"
            label="Número de Documento"
            placeholder="Ingrese su número de documento"
            value={formData.documentNumber}
            onValueChange={(value) => updateFormData({ documentNumber: value })}
            isInvalid={!!errors.documentNumber}
            errorMessage={errors.documentNumber}
          />
        </div>
        
        <div>
          <Input
            label="Nombres"
            placeholder="Ingrese sus nombres"
            value={formData.firstName}
            onValueChange={(value) => updateFormData({ firstName: value })}
            isInvalid={!!errors.firstName}
            errorMessage={errors.firstName}
          />
        </div>
        
        <div>
          <Input
            label="Apellido Paterno"
            placeholder="Ingrese su apellido paterno"
            value={formData.lastName}
            onValueChange={(value) => updateFormData({ lastName: value })}
            isInvalid={!!errors.lastName}
            errorMessage={errors.lastName}
          />
        </div>
        
        <div>
          <Input
            label="Apellido Materno"
            placeholder="Ingrese su apellido materno"
            value={formData.secondLastName}
            onValueChange={(value) => updateFormData({ secondLastName: value })}
            isInvalid={!!errors.secondLastName}
            errorMessage={errors.secondLastName}
          />
        </div>
        
        <div className="flex flex-col">
          <p className="text-sm mb-2">Foto</p>
          <div 
            className={`
              border-2 border-dashed rounded-medium p-4 flex flex-col items-center justify-center h-[140px]
              ${errors.photo ? 'border-danger' : 'border-default-300'}
              ${!photoPreview ? 'cursor-pointer hover:bg-default-100' : ''}
            `}
            onClick={!photoPreview ? triggerFileInput : undefined}
          >
            {photoPreview ? (
              <div className="relative w-full h-full">
                <Image 
                  src={photoPreview} 
                  alt="Preview" 
                  className="w-full h-full object-cover rounded"
                />
                <Button
                  isIconOnly
                  size="sm"
                  color="danger"
                  variant="solid"
                  className="absolute top-0 right-0 m-1"
                  onPress={() => {
                    setPhotoPreview(null);
                    updateFormData({ photo: "" });
                  }}
                >
                  <Icon icon="lucide:x" width={16} />
                </Button>
              </div>
            ) : (
              <>
                <Icon icon="lucide:upload" className="text-default-500 mb-2" width={24} />
                <p className="text-sm text-default-500">Haga clic para subir una foto</p>
              </>
            )}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={handlePhotoChange}
            />
          </div>
          {errors.photo && (
            <p className="text-danger text-xs mt-1">{errors.photo}</p>
          )}
        </div>
      </div>
      
      <div className="flex justify-end mt-8">
        <Button color="primary" type="submit">
          Siguiente
          <Icon icon="lucide:arrow-right" width={16} />
        </Button>
      </div>
    </form>
  );
};