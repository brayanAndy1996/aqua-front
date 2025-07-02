"use client";

import { Product } from "@/types/product";
import {
  Input,
  Textarea,
  Checkbox,
  Button,
  Spinner,
} from "@heroui/react";
import { useProductForm } from "../hooks/useProductForm";
import glassStyles from "@/app/styles/glassStyles.module.css";
import { forwardRef, useImperativeHandle, useEffect } from "react";

interface ProductFormProps {
  product?: Product | null;
  onSuccess: (product?: Product) => void;
  onCancel: () => void;
  onValidityChange?: (isValid: boolean) => void;
  hideButtons?: boolean;
  onFormDataChange?: (formData: Product) => void;
}

export interface ProductFormRef {
  validateForm: () => boolean;
}

const ProductForm = forwardRef<ProductFormRef, ProductFormProps>(function ProductForm(
  {
    product,
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
    handleChange,
    handleSubmit,
    validateForm,
  } = useProductForm({ product: product || null, onSuccess });

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
        !!formData.code?.trim() &&
        !!formData.name?.trim() &&
        formData.sale_price >= 0 &&
        formData.current_stock >= 0 &&
        formData.min_stock >= 0;
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
          {/* Código */}
          <div>
            <Input
              type="text"
              name="code"
              label="Código *"
              value={formData.code || ""}
              onChange={handleChange}
              isInvalid={!!errors.code}
              errorMessage={errors.code}
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
              name="name"
              label="Nombre *"
              value={formData.name || ""}
              onChange={handleChange}
              isInvalid={!!errors.name}
              errorMessage={errors.name}
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

          {/* Precio de venta */}
          <div>
            <Input
              type="number"
              name="sale_price"
              label="Precio de venta *"
              value={formData.sale_price?.toString() || ""}
              onChange={handleChange}
              isInvalid={!!errors.sale_price}
              errorMessage={errors.sale_price}
              variant="bordered"
              radius="lg"
              startContent={
                <div className="pointer-events-none flex items-center">
                  <span className="text-default-400 text-small">$</span>
                </div>
              }
              classNames={{
                base: "bg-white/80",
                label: "text-gray-700",
                input: "text-gray-800",
                inputWrapper:
                  "border-gray-300 data-[hover=true]:border-blue-500",
              }}
            />
          </div>

          {/* Stock actual */}
          <div>
            <Input
              type="number"
              name="current_stock"
              label="Stock actual *"
              value={formData.current_stock?.toString() || ""}
              onChange={handleChange}
              isInvalid={!!errors.current_stock}
              errorMessage={errors.current_stock}
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

          {/* Stock mínimo */}
          <div>
            <Input
              type="number"
              name="min_stock"
              label="Stock mínimo *"
              value={formData.min_stock?.toString() || ""}
              onChange={handleChange}
              isInvalid={!!errors.min_stock}
              errorMessage={errors.min_stock}
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

        {/* Descripción */}
        <div>
          <Textarea
            name="description"
            label="Descripción"
            value={formData.description || ""}
            onChange={handleChange}
            variant="bordered"
            radius="lg"
            placeholder="Descripción del producto"
            minRows={3}
            classNames={{
              base: "bg-white/80",
              label: "text-gray-700",
              input: "text-gray-800",
              inputWrapper:
                "border-gray-300 data-[hover=true]:border-blue-500",
            }}
          />
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
            Producto activo
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
              {product ? "Actualizar" : "Crear"}
            </Button>
          </div>
        )}
      </form>
    </div>
  );
});

export default ProductForm;
