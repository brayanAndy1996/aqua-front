"use client";

import { User } from "@/types/user";
import {
  Input,
  Select,
  SelectItem,
  Checkbox,
  Button,
  Spinner,
} from "@heroui/react";
import { useUserForm } from "../hooks/useUserForm";
import glassStyles from "@/app/styles/glassStyles.module.css";
import { forwardRef, useImperativeHandle, useEffect } from "react";

interface UserFormProps {
  user?: User | null;
  onSuccess: (user?: User) => void;
  onCancel: () => void;
  onValidityChange?: (isValid: boolean) => void;
  hideButtons?: boolean;
  onFormDataChange?: (formData: User) => void;
}

export interface UserFormRef {
  validateForm: () => boolean;
}

const UserForm = forwardRef<UserFormRef, UserFormProps>(function UserForm(
  {
    user,
    onSuccess,
    onCancel,
    onValidityChange,
    hideButtons = false,
    onFormDataChange,
  },
  ref
) {
  const {
    formData,
    loading,
    errors,
    tipoDocumentoOptions,
    handleChange,
    handleSubmit,
    validateForm,
  } = useUserForm({ user, onSuccess, onCancel });

  // Expose validateForm method via ref
  useImperativeHandle(ref, () => ({
    validateForm: () => {
      const isValid = validateForm();
      if (onValidityChange) {
        onValidityChange(isValid);
      }
      return isValid;
    },
  }));

  // Check form validity when values change and notify parent of form data changes
  useEffect(() => {
    if (onValidityChange) {
      const isValid =
        !!formData.email?.trim() &&
        !!formData.nombre?.trim() &&
        !!formData.apellido_paterno?.trim() &&
        !!formData.nro_documento?.trim();
      onValidityChange(isValid);
    }

    // Notify parent component of form data changes
    if (onFormDataChange) {
      onFormDataChange(formData);
    }
  }, [formData, onValidityChange, onFormDataChange]);

  return (
    <div className={`${glassStyles.glassCard} p-6`}>
      <form onSubmit={handleSubmit} className="space-y-6">
        {errors.form && (
          <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
            {errors.form}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Email */}
          <div>
            <Input
              type="email"
              name="email"
              label="Email *"
              value={formData.email || ""}
              onChange={handleChange}
              isInvalid={!!errors.email}
              errorMessage={errors.email}
              variant="bordered"
              radius="lg"
              classNames={{
                base: "bg-white/80",
                label: "text-gray-700",
                input: "text-gray-800",
                inputWrapper:
                  "border-gray-300 data-[hover=true]:border-blue-500",
              }}
            />
          </div>

          {/* Nombre */}
          <div>
            <Input
              type="text"
              name="nombre"
              label="Nombre *"
              value={formData.nombre || ""}
              onChange={handleChange}
              isInvalid={!!errors.nombre}
              errorMessage={errors.nombre}
              variant="bordered"
              radius="lg"
              classNames={{
                base: "bg-white/80",
                label: "text-gray-700",
                input: "text-gray-800",
                inputWrapper:
                  "border-gray-300 data-[hover=true]:border-blue-500",
              }}
            />
          </div>

          {/* Apellido Paterno */}
          <div>
            <Input
              type="text"
              name="apellido_paterno"
              label="Apellido Paterno *"
              value={formData.apellido_paterno || ""}
              onChange={handleChange}
              isInvalid={!!errors.apellido_paterno}
              errorMessage={errors.apellido_paterno}
              variant="bordered"
              radius="lg"
              classNames={{
                base: "bg-white/80",
                label: "text-gray-700",
                input: "text-gray-800",
                inputWrapper:
                  "border-gray-300 data-[hover=true]:border-blue-500",
              }}
            />
          </div>

          {/* Apellido Materno */}
          <div>
            <Input
              type="text"
              name="apellido_materno"
              label="Apellido Materno"
              value={formData.apellido_materno || ""}
              onChange={handleChange}
              variant="bordered"
              radius="lg"
              classNames={{
                base: "bg-white/80",
                label: "text-gray-700",
                input: "text-gray-800",
                inputWrapper:
                  "border-gray-300 data-[hover=true]:border-blue-500",
              }}
            />
          </div>

          {/* Tipo de Documento */}
          <div>
            <Select
              name="tipo_documento_id"
              label="Tipo de Documento"
              selectedKeys={[`${formData.tipo_documento_id || 1}`]}
              onChange={handleChange}
              variant="bordered"
              radius="lg"
              classNames={{
                base: "bg-white/80",
                label: "text-gray-700",
                value: "text-gray-800",
                trigger: "border-gray-300 data-[hover=true]:border-blue-500",
              }}
            >
              {tipoDocumentoOptions.map((option) => (
                <SelectItem key={option.uid} textValue={option.name}>
                  {option.name}
                </SelectItem>
              ))}
            </Select>
          </div>

          {/* Número de Documento */}
          <div>
            <Input
              type="text"
              name="nro_documento"
              label="Número de Documento *"
              value={formData.nro_documento || ""}
              onChange={handleChange}
              isInvalid={!!errors.nro_documento}
              errorMessage={errors.nro_documento}
              variant="bordered"
              radius="lg"
              classNames={{
                base: "bg-white/80",
                label: "text-gray-700",
                input: "text-gray-800",
                inputWrapper:
                  "border-gray-300 data-[hover=true]:border-blue-500",
              }}
            />
          </div>
        </div>

        {/* Estado Activo */}
        <div>
          <Checkbox
            name="is_active"
            isSelected={formData.is_active}
            onChange={handleChange}
            color="primary"
            classNames={{
              label: "text-gray-700",
            }}
          >
            Usuario activo
          </Checkbox>
        </div>

        {/* Buttons - only shown if hideButtons is false */}
        {!hideButtons && (
          <div className="flex justify-end space-x-4 pt-6">
            <Button
              type="button"
              onPress={onCancel}
              variant="bordered"
              color="default"
              radius="lg"
              className="px-6"
              isDisabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              isDisabled={loading}
              isLoading={loading}
              color="primary"
              radius="lg"
              className="px-6"
              spinner={<Spinner size="sm" color="white" />}
            >
              {user ? "Actualizar" : "Crear"}
            </Button>
          </div>
        )}
      </form>
    </div>
  );
});

export default UserForm;
