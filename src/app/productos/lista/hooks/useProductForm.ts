"use client";

import { useState, useCallback, ChangeEvent } from "react";
import { Product } from "@/types/product";
import { useSession } from "next-auth/react";
import { showSuccessToast } from "@/components/toastUtils";
import { handleErrors } from "@/lib/utils/errors";
import { showDangerToast } from "@/components/toastUtils";
import { productApi } from "@/apis/product.api";
// import { createProduct, updateProduct } from "@/apis/product.api"; // Uncomment when API is implemented

interface UseProductFormProps {
  product: Product | null;
  onSuccess: () => void;
}

export function useProductForm({ product, onSuccess }: UseProductFormProps) {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Initialize form data with product values or defaults
  const [formData, setFormData] = useState<Product>({
    id: product?.id || 0,
    code: product?.code || "",
    name: product?.name || "",
    description: product?.description || "",
    sale_price: product?.sale_price || 0,
    current_stock: product?.current_stock || 0,
    min_stock: product?.min_stock || 0,
    is_active: product?.is_active !== undefined ? product.is_active : true
  });
  console.log("🚀 ~ useProductForm ~ formData:", formData)

  // Handle form field changes
  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target || {};
    
    // Handle different input types
    if (type === "checkbox" || name === "is_active") {
      // Type assertion to ensure TypeScript knows this is an HTMLInputElement with a checked property
      const inputElement = e.target as HTMLInputElement;
      setFormData((prev) => ({
        ...prev,
        [name]: inputElement.checked !== undefined ? inputElement.checked : value
      }));
    } else if (type === "number" || name === "sale_price" || name === "current_stock" || name === "min_stock") {
      setFormData((prev) => ({
        ...prev,
        [name]: parseFloat(value) || 0
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Clear error for this field when it changes
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  }, [errors]);

  // Validate form fields
  const validateForm = useCallback(() => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.code?.trim()) {
      newErrors.code = "El código es obligatorio";
    }
    
    if (!formData.name?.trim()) {
      newErrors.name = "El nombre es obligatorio";
    }
    
    if (formData.sale_price < 0) {
      newErrors.sale_price = "El precio de venta debe ser mayor o igual a 0";
    }
    
    if (formData.current_stock < 0) {
      newErrors.current_stock = "El stock actual debe ser mayor o igual a 0";
    }
    
    if (formData.min_stock < 0) {
      newErrors.min_stock = "El stock mínimo debe ser mayor o igual a 0";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  // Handle form submission
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    if (!session?.user?.accessToken) {
      showDangerToast('Error al crear usuario', 'No se encontro el token de acceso');
      return;
    }
    
    setLoading(true);
    console.log("🚀 ~ useProductForm ~ formData:", formData)
    
    try {
      if (product?.id) {
        // Update existing product - this is a placeholder until the API is implemented
        const response = await productApi.updateProduct(product.id, formData);
        showSuccessToast("Producto actualizado", response.message);
      } else {
        // Create new product - this is a placeholder until the API is implemented
        const response = await productApi.createProduct(formData);
        showSuccessToast("Producto creado", response.message);
      }
      onSuccess();
    } catch (error) {
      handleErrors(error);
      setErrors((prev) => ({
        ...prev,
        form: "Hubo un error al guardar el producto. Por favor, inténtelo de nuevo."
      }));
    } finally {
      setLoading(false);
    }
  }, [onSuccess, product?.id, validateForm, session?.user?.accessToken, formData]);

  return {
    formData,
    loading,
    errors,
    handleChange,
    handleSubmit,
    validateForm
  };
}

export default useProductForm;
