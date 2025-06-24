import { useCallback } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
  Tooltip,
} from "@heroui/react";
import { KeyIcon } from "@/lib/icons/ui";
import { User } from "@/types/user";
import AssignRoleUser from "./AssignRoleUser";



interface RoleAssignmentModalProps {
  user: User;
  refreshUsers: () => void;
}

const RoleAssignmentModal: React.FC<RoleAssignmentModalProps> = ({user, refreshUsers}: RoleAssignmentModalProps) => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const handleOpenModal = () => {
    onOpen();
  };
   const handleSuccess = useCallback(() => {
      onClose();
      refreshUsers();
    }, [onClose, refreshUsers]);
  
    const handleCancel = useCallback(() => {
      onClose();
    }, [onClose]);

  return (
    <div>
      <Tooltip content="Asignar Roles" color="secondary">
        <span
          className="text-lg text-secondary cursor-pointer active:opacity-50"
          onClick={() => handleOpenModal()}
        >
          <KeyIcon />
        </span>
      </Tooltip>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        scrollBehavior="inside"
        classNames={{
          base: "bg-white/90 backdrop-blur-md dark:bg-gray-900/90",
          header: "border-b border-gray-200 dark:border-gray-700",
          body: "py-6",
          footer: "border-t border-gray-200 dark:border-gray-700",
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
              <ModalHeader className="flex flex-col gap-1">
                Asignar Roles de Usuario
              </ModalHeader>
              <ModalBody>
                 <AssignRoleUser user={user} onClose={handleCancel} onSuccess={handleSuccess}/>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default RoleAssignmentModal;
