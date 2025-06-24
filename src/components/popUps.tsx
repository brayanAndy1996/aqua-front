"use client";

import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Tooltip
} from "@heroui/react";

interface ConfirmationPopUpProps {
  // Icon component to show in the trigger button
  icon?: React.ReactNode;
  // Text to show in the tooltip
  tooltipContent?: string;
  // Color for the tooltip and delete button
  color?: "primary" | "secondary" | "success" | "warning" | "danger" | "default";
  // Title for the confirmation modal
  title?: string;
  // Message to show in the confirmation modal
  message?: string;
  // Text for the confirm button
  confirmText?: string;
  // Text for the cancel button
  cancelText?: string;
  // Callback function to execute when confirmed
  onConfirm: () => void;
  // Whether the confirmation action is loading
  isLoading?: boolean;
  // Custom class for the trigger button
  className?: string;
  // Whether the trigger button is disabled
  disabled?: boolean;
  // Custom trigger element (replaces the default icon button)
  customTrigger?: React.ReactNode;
}

/**
 * A reusable confirmation popup component that can be used throughout the system.
 * It shows a button with an icon that, when clicked, opens a modal asking for confirmation.
 */
export const ConfirmationPopUp: React.FC<ConfirmationPopUpProps> = ({
  icon,
  tooltipContent = "Eliminar",
  color = "danger",
  title = "Delete this item?",
  message = "This item will be deleted from your device. You can restore this item from recycle bin",
  confirmText = "Eliminar",
  cancelText = "Cancelar",
  onConfirm,
  isLoading = false,
  className = "",
  disabled = false,
  customTrigger
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const triggerButton = customTrigger ? (
    <div onClick={onOpen}>{customTrigger}</div>
  ) : (
    <Tooltip color={color} content={tooltipContent}>
      <span
        className={`text-lg text-${color} cursor-pointer active:opacity-50 ${className}`}
        onClick={onOpen}
        aria-label={tooltipContent}
      >
        {icon}
      </span>
    </Tooltip>
  );

  return (
    <>
      {disabled ? (
        <span className={`text-lg text-${color} cursor-not-allowed opacity-50`}>
          {icon}
        </span>
      ) : (
        triggerButton
      )}

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>
          <ModalBody>
            <p>{message}</p>
          </ModalBody>
          <ModalFooter>
            <Button color="default" variant="light" onPress={onClose}>
              {cancelText}
            </Button>
            <Button 
              color={color} 
              onPress={handleConfirm}
              isLoading={isLoading}
            >
              {confirmText}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ConfirmationPopUp;