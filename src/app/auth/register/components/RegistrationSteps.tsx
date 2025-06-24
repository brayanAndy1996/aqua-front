import { StudentDataForm } from "@/app/auth/register/components/StudentDataForm";
import { CycleSelection } from "@/app/auth/register/components/CycleSelection";
import { PaymentForm } from "@/app/auth/register/components/PaymentForm";
import { RegistrationConfirmation } from "@/app/auth/register/components/RegistrationConfirmation";
import { FormDataRegister, Step } from "@/lib/types/register";

export const registrationSteps = (
  formData: FormDataRegister,
  updateFormData: (data: Partial<FormDataRegister>) => void,
  handleNext: () => void,
  handlePrevious: () => void
): Step[] => [
  {
    title: "Datos del Estudiante",
    description: "Información personal",
    component: (
      <StudentDataForm
        formData={formData}
        updateFormData={updateFormData}
        onNext={handleNext}
      />
    ),
  },
  {
    title: "Ciclo / Área",
    description: "Selección académica",
    component: (
      <CycleSelection
        formData={formData}
        updateFormData={updateFormData}
        onNext={handleNext}
        onPrevious={handlePrevious}
      />
    ),
  },
  {
    title: "Pago",
    description: "Método de pago",
    component: (
      <PaymentForm
        formData={formData}
        updateFormData={updateFormData}
        onNext={handleNext}
        onPrevious={handlePrevious}
      />
    ),
  },
  {
    title: "Confirmación",
    description: "Resumen de registro",
    component: (
      <RegistrationConfirmation
        formData={formData}
        onPrevious={handlePrevious}
      />
    ),
  },
];
