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
import UserForm from "./UserForm";
import { EditIcon } from "@/lib/icons/ui";
import { User } from "@/types/user";
import { useState, useCallback } from "react";

const ModalEditUser = ({
  refreshUsers,
  user,
}: {
  refreshUsers: () => void;
  user: User;
}) => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleEditUser = useCallback(
    (user: User) => {
      setSelectedUser(user);
      onOpen();
    },
    [onOpen]
  );

  const handleSuccess = useCallback(() => {
    onClose();
    setSelectedUser(null);
    refreshUsers();
    setError(null);
  }, [onClose, refreshUsers, setError]);

  const handleCancel = useCallback(() => {
    onClose();
    setSelectedUser(null);
    setError(null);
  }, [onClose, setError]);
  return (
    <div>
      <Tooltip content="Editar Usuario" color="primary">
        <span
          className="text-lg text-primary cursor-pointer active:opacity-50"
          onClick={() => handleEditUser(user)}
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
                 <ModalHeader className="flex flex-col gap-1 text-center pt-2">{user ? 'Editar Usuario' : 'Crear Nuevo Usuario'}</ModalHeader>
                <UserForm
                  user={selectedUser}
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

export default ModalEditUser;
