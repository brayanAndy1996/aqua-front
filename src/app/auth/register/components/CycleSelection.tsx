import { useState } from "react";
import { Button, Card, CardBody, Radio, RadioGroup } from "@heroui/react";
import { Icon } from "@iconify/react";

// Define el tipo explícitamente
interface FormData {
  cycle: string;
  area: string;
}

interface CycleSelectionProps {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
  onNext: () => void;
  onPrevious: () => void;
}

export const CycleSelection: React.FC<CycleSelectionProps> = ({
  formData,
  updateFormData,
  onNext,
  onPrevious,
}) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const cycles = [
    { id: "cycle1", name: "Ciclo I", description: "Primer ciclo académico" },
    { id: "cycle2", name: "Ciclo II", description: "Segundo ciclo académico" },
    { id: "cycle3", name: "Ciclo III", description: "Tercer ciclo académico" },
    { id: "cycle4", name: "Ciclo IV", description: "Cuarto ciclo académico" },
  ];

  const areas = [
    { id: "science", name: "Ciencias", description: "Matemáticas, Física, Química" },
    { id: "humanities", name: "Humanidades", description: "Literatura, Historia, Filosofía" },
    { id: "engineering", name: "Ingeniería", description: "Sistemas, Civil, Industrial" },
    { id: "health", name: "Salud", description: "Medicina, Enfermería, Nutrición" },
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.cycle) {
      newErrors.cycle = "Seleccione un ciclo";
    }
    
    if (!formData.area) {
      newErrors.area = "Seleccione un área";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onNext();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold mb-6">Selección de Ciclo y Área</h2>
      
      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-medium mb-4">Ciclo Académico</h3>
          {errors.cycle && (
            <p className="text-danger text-sm mb-2">{errors.cycle}</p>
          )}
          <RadioGroup
            value={formData.cycle}
            onValueChange={(value) => updateFormData({ cycle: value })}
            orientation="horizontal"
            className="gap-4 flex-wrap"
          >
            {cycles.map((cycle) => (
              <Radio
                key={cycle.id}
                value={cycle.id}
                className="p-0"
                classNames={{
                  base: "m-0"
                }}
              >
                <Card
                  isPressable
                  className={`w-full md:w-[220px] ${
                    formData.cycle === cycle.id ? "border-2 border-primary" : ""
                  }`}
                >
                  <CardBody className="p-4">
                    <div className="flex items-start">
                      <div>
                        <h4 className="font-medium">{cycle.name}</h4>
                        <p className="text-sm text-default-500">{cycle.description}</p>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </Radio>
            ))}
          </RadioGroup>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-4">Área de Estudio</h3>
          {errors.area && (
            <p className="text-danger text-sm mb-2">{errors.area}</p>
          )}
          <RadioGroup
            value={formData.area}
            onValueChange={(value) => updateFormData({ area: value })}
            orientation="horizontal"
            className="gap-4 flex-wrap"
          >
            {areas.map((area) => (
              <Radio
                key={area.id}
                value={area.id}
                className="p-0"
                classNames={{
                  base: "m-0"
                }}
              >
                <Card
                  isPressable
                  className={`w-full md:w-[220px] ${
                    formData.area === area.id ? "border-2 border-primary" : ""
                  }`}
                >
                  <CardBody className="p-4">
                    <div className="flex items-start">
                      <div>
                        <h4 className="font-medium">{area.name}</h4>
                        <p className="text-sm text-default-500">{area.description}</p>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </Radio>
            ))}
          </RadioGroup>
        </div>
      </div>
      
      <div className="flex justify-between mt-8">
        <Button 
          variant="flat" 
          onPress={onPrevious}
          startContent={<Icon icon="lucide:arrow-left" width={16} />}
        >
          Anterior
        </Button>
        <Button 
          color="primary" 
          type="submit"
          endContent={<Icon icon="lucide:arrow-right" width={16} />}
        >
          Siguiente
        </Button>
      </div>
    </form>
  );
};