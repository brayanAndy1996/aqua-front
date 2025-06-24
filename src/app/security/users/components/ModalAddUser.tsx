"use client";

import React from "react";
import {
  Modal,
  ModalContent,
  ModalBody,
  ModalHeader,
  Button,
  Tooltip,
  Spinner,
} from "@heroui/react";
import UserForm from "./UserForm";
import AssignRoleUser from "./AssignRoleUser";
import { PlusIcon } from "@/lib/icons/ui";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { User } from "@/types/user";
import { useAddUser } from "../hooks/useAddUser";

const ModalAddUser = ({ refreshUsers }: { refreshUsers: () => void }) => {
  const {
    isOpen,
    onOpen,
    onOpenChange,
    error,
    currentStep,
    createdUser,
    formIsValid,
    loading,
    userFormRef,
    userData,
    selectedRoles,
    handleFormDataChange,
    handleRolesChange,
    handleSubmitUserForm,
    handleCancel,
    handleFormValidityChange,
    handleStepClick,
    handleNext,
    handlePrevious,
    steps
  } = useAddUser({ refreshUsers });

  return (
    <div>
      <Button
        onPress={onOpen}
        color="primary"
        endContent={<PlusIcon />}
        size="sm"
        className="bg-foreground text-background"
      >
        Nuevo Usuario
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
              Crear Nuevo Usuario
              <div className="w-full px-6 mt-4">
                <div className="flex justify-between w-full relative">
                  {steps.map((step, index) => (
                    <div
                      key={index}
                      onClick={() => handleStepClick(index)}
                      className={`flex flex-col items-center cursor-pointer transition-all duration-300 ${
                        index === currentStep
                          ? "text-primary-500"
                          : index === 1 && !formIsValid && !createdUser
                          ? "text-gray-300 cursor-not-allowed"
                          : "text-gray-400 hover:text-gray-600"
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 transition-all duration-300 ${
                          index === currentStep
                            ? "bg-primary-500 text-white"
                            : index === 1 && !formIsValid && !createdUser
                            ? "bg-gray-200 text-gray-400"
                            : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                        }`}
                      >
                        {index + 1}
                      </div>
                      <div className="text-xs">{step.title}</div>
                      <div className="text-xs opacity-70">
                        {step.description}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="w-full h-1 bg-gray-200 mt-2 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary-500 transition-all duration-300"
                    style={{
                      width: `${(currentStep / (steps.length - 1)) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </ModalHeader>

            <div className="relative w-full min-h-[400px] overflow-hidden">
              {/* Form Content with navigation buttons as absolute positioned elements */}
              <div className="w-full px-8 overflow-y-auto relative">
                {/* Left Navigation Button - absolute positioned */}
                {currentStep > 0 && (
                  <div className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10">
                    <Tooltip content="Anterior">
                      <Button
                        isIconOnly
                        size="lg"
                        variant="light"
                        onPress={handlePrevious}
                        className="rounded-full bg-white/80 shadow-lg border border-gray-200"
                      >
                        <ChevronLeftIcon className="w-6 h-6" />
                      </Button>
                    </Tooltip>
                  </div>
                )}
                {currentStep === 0 ? (
                  <UserForm
                    ref={userFormRef}
                    user={userData}
                    onSuccess={() => {}}
                    onCancel={handleCancel}
                    onValidityChange={handleFormValidityChange}
                    onFormDataChange={handleFormDataChange}
                    hideButtons={true}
                  />
                ) : (
                  <div className="w-full">
                    <AssignRoleUser
                      user={createdUser || ({ id: 0 } as User)}
                      onClose={handleCancel}
                      onSuccess={() => {}}
                      onRolesChange={handleRolesChange}
                      hideButtons={true}
                      initialSelectedRoles={selectedRoles}
                    />
                  </div>
                )}
              </div>

              {/* Centralized buttons for both steps */}
              <div className="flex justify-center md:justify-end space-x-4 pt-6 mt-4 pb-4">
                <Button
                  type="button"
                  onPress={handleCancel}
                  variant="bordered"
                  color="default"
                  radius="lg"
                  className="px-6"
                  isDisabled={loading}
                >
                  Cancelar
                </Button>
                <Button
                  type="button"
                  isDisabled={loading || (currentStep === 0 && !formIsValid)}
                  isLoading={loading}
                  color="primary"
                  radius="lg"
                  className="px-6"
                  spinner={<Spinner size="sm" color="white" />}
                  onPress={ handleSubmitUserForm }
                >
                  Crear Usuario
                </Button>
              </div>

              {/* Right Navigation Button - absolute positioned */}
              {currentStep < steps.length - 1 && (
                <div className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10">
                  <Tooltip content="Siguiente">
                    <Button
                      isIconOnly
                      size="lg"
                      variant="light"
                      onPress={handleNext}
                      isDisabled={!formIsValid}
                      className={`rounded-full ${
                        formIsValid
                          ? "bg-white/80 shadow-lg border border-gray-200"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      <ChevronRightIcon className="w-6 h-6" />
                    </Button>
                  </Tooltip>
                </div>
              )}
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default ModalAddUser;
