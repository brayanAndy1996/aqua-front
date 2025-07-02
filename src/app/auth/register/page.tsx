"use client";
import { useState } from "react";
import { Card, CardBody } from "@heroui/react";
import { RegistrationStepper } from "@/app/auth/register/components/RegistrationStepper";
import { registrationSteps } from "@/app/auth/register/components/RegistrationSteps";
import { FormDataRegister } from "@/types/register";

export default function RegisterPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormDataRegister>({
    documentType: "",
    documentNumber: "",
    firstName: "",
    lastName: "",
    secondLastName: "",
    photo: "",
    cycle: "",
    area: "",
    paymentMethod: "",
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
  });

  const updateFormData = (data: Partial<FormDataRegister>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 3));
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const steps = registrationSteps(formData, updateFormData, handleNext, handlePrevious);
  
  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-semibold text-center mb-8">
          Registro de Estudiante
        </h1>

        <Card className="mb-8">
          <CardBody>
            <RegistrationStepper steps={steps} currentStep={currentStep} />
          </CardBody>
        </Card>

        <Card>
          <CardBody className="p-6">{steps[currentStep].component}</CardBody>
        </Card>
      </div>
    </div>
  );
}
