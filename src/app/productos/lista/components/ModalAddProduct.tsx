"use client";

import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalBody,
  ModalHeader,
  Button,
  useDisclosure
} from "@heroui/react";
import ProductForm from "./ProductForm";
import { PlusIcon } from "@/lib/icons/ui";

const ModalAddProduct = ({ refreshProducts }: { refreshProducts: () => void }) => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [error, setError] = useState<string | null>(null);

  const handleSuccess = () => {
    onClose();
    refreshProducts();
    setError(null);
  };

  const handleCancel = () => {
    onClose();
    setError(null);
  };

  return (
    <div>
      <Button
        onPress={onOpen}
        color="primary"
        endContent={<PlusIcon />}
        size="sm"
        className="bg-foreground text-background"
      >
        Nuevo Producto
      </Button>

      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="center"
        size="lg"
        isDismissable={false}
        classNames={{
          base: "max-h-[90vh] overflow-hidden",
          body: "p-0",
        }}
        motionProps={{
          initial: { opacity: 0, scale: 0.95 },
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
        }}
      >
        <ModalContent>
          <ModalBody>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                {error}
              </div>
            )}
            <ModalHeader className="flex flex-col gap-1 text-center pt-2">
              Crear Nuevo Producto
            </ModalHeader>

            <div className="relative w-full min-h-[400px] overflow-hidden">
              <div className="w-full px-8 overflow-y-auto relative">
                <ProductForm
                  product={null}
                  onSuccess={handleSuccess}
                  onCancel={handleCancel}
                />
              </div>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default ModalAddProduct;
