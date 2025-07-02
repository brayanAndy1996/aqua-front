import React from "react";
import { Modal, ModalBody, Progress, ModalContent, Button } from "@heroui/react";
import styles from "@/app/styles/glassStyles.module.css";
import { motion, AnimatePresence } from "framer-motion";

interface CheckoutLoadingProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  progress?: number;
  status?: "loading" | "success" | "error";
  onContinue?: () => void;
}

const CheckoutLoading: React.FC<CheckoutLoadingProps> = ({
  isOpen,
  onOpenChange,
  progress,
  status = "loading",
  onContinue
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      backdrop="blur"
      placement="center"
      classNames={{
        base: `${styles.glassCardNoHeight}`,
        backdrop:
          "bg-gradient-to-br from-blue-900/20 via-cyan-900/20 to-teal-900/20 backdrop-blur-md",
      }}
      motionProps={{
        variants: {
          enter: {
            y: 0,
            opacity: 1,
            transition: {
              duration: 0.3,
              ease: "easeOut",
            },
          },
          exit: {
            y: -20,
            opacity: 0,
            transition: {
              duration: 0.2,
              ease: "easeIn",
            },
          },
        },
      }}
    >
      <ModalContent>
        <ModalBody className="py-6">
          <AnimatePresence mode="wait">
            {status === "loading" ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center gap-4"
              >
                <div className="relative w-40 h-40 flex items-center justify-center bg-blue-100 rounded-full">
                  <span className="text-6xl">🏊‍♂️</span>
                </div>

                <h3 className="text-xl font-semibold text-center text-gray-800">
                  Procesando su compra
                </h3>

                <p className="text-center text-gray-600 max-w-xs">
                  Estamos procesando su transacción. Por favor espere un momento
                  mientras completamos su compra.
                </p>

                {progress !== undefined && (
                  <div className="w-full max-w-md mt-2">
                    <Progress
                      value={progress}
                      color="primary"
                      size="md"
                      radius="sm"
                      showValueLabel={true}
                      aria-label="Progreso de procesamiento de venta"
                      classNames={{
                        base: "max-w-md",
                        track: "drop-shadow-md border border-default",
                        indicator: "bg-gradient-to-r from-blue-500 to-cyan-500",
                        label: "tracking-wider font-medium text-blue-500",
                        value: "text-blue-500",
                      }}
                    />
                  </div>
                )}

                <div className="flex gap-2 items-center mt-2">
                  <div className="animate-pulse w-2 h-2 rounded-full bg-blue-400"></div>
                  <div className="animate-pulse delay-100 w-2 h-2 rounded-full bg-cyan-400"></div>
                  <div className="animate-pulse delay-200 w-2 h-2 rounded-full bg-teal-400"></div>
                </div>
              </motion.div>
            ) : status === "success" ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center justify-center gap-4 p-6 bg-white rounded-3xl shadow-lg max-w-xs w-full mx-auto"
              >
                <div className="relative w-24 h-24 flex items-center justify-center bg-blue-100 rounded-full mx-auto">
                  <svg className="w-12 h-12 text-blue-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M8 12L11 15L16 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>

                <h3 className="text-2xl font-bold text-center text-gray-800 mt-4">
                  ¡Pago Exitoso!
                </h3>

                <p className="text-center text-gray-600 text-sm mt-2">
                  Gracias por su compra con nosotros.
                </p>

                <Button
                  color="primary"
                  className="mt-6 rounded-full px-8 w-full"
                  onPress={onContinue}
                >
                  Continuar
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="error"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center justify-center gap-4 p-6 bg-white rounded-3xl shadow-lg max-w-xs w-full mx-auto"
              >
                <div className="relative w-24 h-24 flex items-center justify-center mx-auto">
                  <svg className="w-20 h-20 text-red-500" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M50 10L90 90H10L50 10Z" fill="#FEE2E2" stroke="#EF4444" strokeWidth="4"/>
                    <rect x="45" y="35" width="10" height="30" rx="2" fill="#EF4444"/>
                    <circle cx="50" cy="75" r="5" fill="#EF4444"/>
                  </svg>
                </div>

                <h3 className="text-2xl font-bold text-center text-gray-800 mt-4">
                  Error en el Pago
                </h3>

                <p className="text-center text-gray-600 text-sm mt-2">
                  Lo sentimos, ha ocurrido un error al procesar su pago. Por favor intente nuevamente.
                </p>

                <Button
                  color="danger"
                  className="mt-6 rounded-full px-8 w-full"
                  onPress={onContinue}
                >
                  Intentar de nuevo
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default CheckoutLoading;
