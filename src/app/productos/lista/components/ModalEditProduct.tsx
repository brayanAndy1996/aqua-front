"use client";

import React from "react";
import {
  Modal,
  ModalContent,
  ModalBody,
  ModalHeader,
  useDisclosure,
  Tooltip,
} from "@heroui/react";
import ProductForm from "./ProductForm";
import { EditIcon } from "@/lib/icons/ui";
import { Product } from "@/types/product";
import { useState, useCallback } from "react";

const ModalEditProduct = ({
  refreshProducts,
  product,
}: {
  refreshProducts: () => void;
  product: Product;
}) => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleEditProduct = useCallback(
    (product: Product) => {
      setSelectedProduct(product);
      onOpen();
    },
    [onOpen]
  );

  const handleSuccess = useCallback(() => {
    onClose();
    setSelectedProduct(null);
    refreshProducts();
    setError(null);
  }, [onClose, refreshProducts]);

  const handleCancel = useCallback(() => {
    onClose();
    setSelectedProduct(null);
    setError(null);
  }, [onClose]);
  
  return (
    <div>
      <Tooltip content="Editar Producto" color="primary">
        <span
          className="text-lg text-primary cursor-pointer active:opacity-50"
          onClick={() => handleEditProduct(product)}
        >
          <EditIcon />
        </span>
      </Tooltip>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="center"
        backdrop="blur"
        classNames={{
          base: "bg-white/80 backdrop-blur-md border border-white/20 shadow-xl rounded-xl",
          header: "border-b border-white/30 p-0",
          body: "p-0",
          footer: "border-t border-white/30 p-0",
        }}
        motionProps={{
          variants: {
            enter: {
              opacity: 1,
              scale: 1,
              transition: {
                duration: 0.3,
                ease: "easeOut",
              },
            },
            exit: {
              opacity: 0,
              scale: 0.95,
              transition: {
                duration: 0.2,
                ease: "easeIn",
              },
            },
          },
          initial: { opacity: 0, scale: 0.95 },
        }}
      >
        <ModalContent>
          {() => (
            <>
              <ModalBody>
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                    {error}
                  </div>
                )}
                <ModalHeader className="flex flex-col gap-1 text-center pt-2">Editar Producto</ModalHeader>
                <ProductForm
                  product={selectedProduct || product}
                  onSuccess={handleSuccess}
                  onCancel={handleCancel}
                />
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default ModalEditProduct;
