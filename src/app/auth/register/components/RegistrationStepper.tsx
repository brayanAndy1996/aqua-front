import React from "react";
import { Progress } from "@heroui/react";
import { Icon } from "@iconify/react";
import { RegistrationStepperProps } from "@/lib/types/register";

export const RegistrationStepper: React.FC<RegistrationStepperProps> = ({
  steps,
  currentStep,
}) => {
  const progressValue = ((currentStep) / (steps.length - 1)) * 100;

  return (
    <div className="w-full">
      <Progress 
        aria-label="Registration progress" 
        value={progressValue} 
        className="mb-6"
        color="primary"
        size="md"
      />
      
      <div className="flex justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isActive = index === currentStep;
          
          return (
            <div 
              key={index} 
              className={`flex flex-col items-center ${index < steps.length - 1 ? 'w-1/4' : ''}`}
            >
              <div 
                className={`
                  flex items-center justify-center w-10 h-10 rounded-full mb-2
                  ${isCompleted ? 'bg-primary text-white' : 
                    isActive ? 'bg-primary-100 text-primary border-2 border-primary' : 
                    'bg-default-100 text-default-500'}
                `}
              >
                {isCompleted ? (
                  <Icon icon="lucide:check" width={20} />
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>
              <div className="text-center">
                <p className={`text-sm font-medium ${isActive || isCompleted ? 'text-foreground' : 'text-default-500'}`}>
                  {step.title}
                </p>
                <p className="text-xs text-default-400">{step.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};