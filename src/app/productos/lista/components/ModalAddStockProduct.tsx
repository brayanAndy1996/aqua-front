
"use client";

import React from "react";
import {
  Modal,
  ModalContent,
  ModalBody,
  ModalHeader,
  useDisclosure,
  Tooltip
} from "@heroui/react";
import { StockIcon } from "@/lib/icons/product";
import { Product } from "@/types/product";
import StockForm from "./StockForm";


const ModalAddStockProduct = ({
  refreshProducts,
  product,
}: {
  refreshProducts: () => void;
  product: Product;
}) => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  return (
    <div>
      <Tooltip content="Agregar Stock" color="secondary">
        <span
          className="text-lg text-secondary cursor-pointer active:opacity-50 mr-2"
          onClick={onOpen}
        >
          <StockIcon />
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
                <ModalHeader className="flex flex-col gap-1 text-center pt-4">
                  Agregar Stock a Producto
                </ModalHeader>
                <StockForm 
                    product={product}
                    refreshProducts={refreshProducts}
                    onClose={onClose}
                />
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default ModalAddStockProduct;
