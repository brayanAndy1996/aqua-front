import { useState, useCallback, useRef } from "react";
import { User } from "@/types/user";
import { useSession } from "next-auth/react";
import { userApi } from "@/apis/user.api";
import { showSuccessToast, showDangerToast } from "@/components/toastUtils";
import { useDisclosure } from "@heroui/react";
import { UserFormRef } from "../components/UserForm";

interface UseAddUserProps {
  refreshUsers: () => void;
}

interface UseAddUserReturn {
  isOpen: boolean;
  onOpen: () => void;
  onOpenChange: (isOpen: boolean) => void;
  onClose: () => void;
  error: string | null;
  currentStep: number;
  createdUser: User | null;
  formIsValid: boolean;
  loading: boolean;
  userFormRef: React.RefObject<UserFormRef | null>;
  userData: User;
  selectedRoles: string[];
  handleFormDataChange: (formData: User) => void;
  handleRolesChange: (roles: string[]) => void;
  handleSubmitUserForm: () => Promise<void>;
  handleCancel: () => void;
  handleFormValidityChange: (isValid: boolean) => void;
  handleStepClick: (stepIndex: number) => void;
  handleNext: () => void;
  handlePrevious: () => void;
  steps: { title: string; description: string }[];
}

export function useAddUser({ refreshUsers }: UseAddUserProps): UseAddUserReturn {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const { data: session } = useSession();
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [createdUser, setCreatedUser] = useState<User | null>(null);
  const [formIsValid, setFormIsValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const userFormRef = useRef<UserFormRef>(null);

  // State for centralized data handling
  const [userData, setUserData] = useState<User>({
    email: "",
    nombre: "",
    apellido_paterno: "",
    apellido_materno: "",
    is_active: true,
    nro_documento: "",
    tipo_documento_id: 1,
    roles: [],
  });
  
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);

  // Handle form data changes from UserForm
  const handleFormDataChange = useCallback((formData: User) => {
    setUserData(formData);
  }, []);

  // Handle selected roles changes from AssignRoleUser
  const handleRolesChange = useCallback((roles: string[]) => {
    setSelectedRoles(roles);
  }, []);

  // Handle submit for step 1 (user creation)
  const handleSubmitUserForm = useCallback(async () => {

    if (!session?.user?.accessToken) {
      showDangerToast("Error", "No se encontró información de autenticación");
      return;
    }

    setLoading(true);
    try {
      const response = await userApi.createUser(
        {...userData, rolesIds: selectedRoles.map(Number)}
      );
      showSuccessToast("Usuario creado", response.message);
      setCreatedUser(response.data);
      setCurrentStep(1);
      setFormIsValid(true);
      refreshUsers();
      onClose();
    } catch (error) {
      setError(typeof error === "string" ? error : "Error al crear el usuario");
    } finally {
      setLoading(false);
    }
  }, [userData, session, refreshUsers, selectedRoles, onClose]);



  const handleCancel = useCallback(() => {
    onClose();
    setError(null);
    setCurrentStep(0);
    setCreatedUser(null);
    setUserData({
      email: "",
      nombre: "",
      apellido_paterno: "",
      apellido_materno: "",
      is_active: true,
      nro_documento: "",
      tipo_documento_id: 1,
      roles: [],
    });
    setSelectedRoles([]);
  }, [onClose]);

  const handleFormValidityChange = useCallback((isValid: boolean) => {
    setFormIsValid(isValid);
  }, []);

  const handleStepClick = useCallback(
    (stepIndex: number) => {
      // Only allow going to step 2 if form is valid or user is created
      if (stepIndex === 1 && !createdUser && !formIsValid) {
        // Try to validate form
        if (userFormRef.current && userFormRef.current.validateForm()) {
          setFormIsValid(true);
          setCurrentStep(stepIndex);
        }
        return;
      }

      setCurrentStep(stepIndex);
    },
    [createdUser, formIsValid]
  );

  const handleNext = useCallback(() => {
    if (currentStep === 0) {
      if (
        createdUser ||
        (userFormRef.current && userFormRef.current.validateForm())
      ) {
        setFormIsValid(true);
        setCurrentStep(1);
      }
    }
  }, [currentStep, createdUser]);

  const handlePrevious = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep]);

  const steps = [
    { title: "Datos del Usuario", description: "Información básica" },
    { title: "Asignar Roles", description: "Permisos del usuario" },
  ];

  return {
    isOpen,
    onOpen,
    onOpenChange,
    onClose,
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
    steps,
  };
}
