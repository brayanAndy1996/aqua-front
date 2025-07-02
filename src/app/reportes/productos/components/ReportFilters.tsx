"use client";

import { motion } from 'framer-motion';
import { 
  Input, 
  Select, 
  SelectItem, 
  DatePicker, 
  Button,
  Card,
  CardBody,
  Switch
} from '@heroui/react';
import { CalendarIcon, MagnifyingGlassIcon, UserIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

interface ReportFiltersProps {
  filters: {
    userId: string;
    productName: string;
    productCode: string;
    startDate: string;
    endDate: string;
    singleDate: string;
  };
  onFiltersChange: (filters: any) => void;
  type: 'sales' | 'purchases';
}

// Mock data para usuarios
const mockUsers = [
  { id: '1', name: 'Juan Pérez', email: 'juan@aquacontrol.com' },
  { id: '2', name: 'María García', email: 'maria@aquacontrol.com' },
  { id: '3', name: 'Carlos López', email: 'carlos@aquacontrol.com' },
  { id: '4', name: 'Ana Martínez', email: 'ana@aquacontrol.com' },
];

export default function ReportFilters({ filters, onFiltersChange, type }: ReportFiltersProps) {
  const [isRangeDate, setIsRangeDate] = useState(false);

  const handleFilterChange = (key: string, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const handleDateModeChange = (isRange: boolean) => {
    setIsRangeDate(isRange);
    // Limpiar fechas cuando cambia el modo
    onFiltersChange({
      ...filters,
      startDate: '',
      endDate: '',
      singleDate: ''
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      userId: '',
      productName: '',
      productCode: '',
      startDate: '',
      endDate: '',
      singleDate: ''
    });
    setIsRangeDate(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-white/70 backdrop-blur-md border-0 shadow-lg">
        <CardBody className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-800">
              Filtros de {type === 'sales' ? 'Ventas' : 'Compras'}
            </h3>
            <Button
              variant="flat"
              color="danger"
              size="sm"
              onPress={clearFilters}
            >
              Limpiar Filtros
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* Filtro por Usuario */}
            <Select
              label="Usuario"
              placeholder="Seleccionar usuario"
              selectedKeys={filters.userId ? [filters.userId] : []}
              onSelectionChange={(keys) => {
                const selectedKey = Array.from(keys)[0] as string;
                handleFilterChange('userId', selectedKey || '');
              }}
              startContent={<UserIcon className="w-4 h-4 text-gray-400" />}
              classNames={{
                trigger: "bg-white/50 backdrop-blur-sm border-gray-200",
              }}
            >
              {mockUsers.map((user) => (
                <SelectItem key={user.id} value={user.id}>
                  {user.name}
                </SelectItem>
              ))}
            </Select>

            {/* Filtro por Nombre de Producto */}
            <Input
              label="Nombre del Producto"
              placeholder="Buscar por nombre..."
              value={filters.productName}
              onValueChange={(value) => handleFilterChange('productName', value)}
              startContent={<MagnifyingGlassIcon className="w-4 h-4 text-gray-400" />}
              classNames={{
                inputWrapper: "bg-white/50 backdrop-blur-sm border-gray-200",
              }}
            />

            {/* Filtro por Código de Producto */}
            <Input
              label="Código del Producto"
              placeholder="Buscar por código..."
              value={filters.productCode}
              onValueChange={(value) => handleFilterChange('productCode', value)}
              startContent={<MagnifyingGlassIcon className="w-4 h-4 text-gray-400" />}
              classNames={{
                inputWrapper: "bg-white/50 backdrop-blur-sm border-gray-200",
              }}
            />

            {/* Switch para tipo de fecha */}
            <div className="flex flex-col justify-center">
              <Switch
                isSelected={isRangeDate}
                onValueChange={handleDateModeChange}
                size="sm"
                color="primary"
              >
                <span className="text-sm text-gray-600">
                  {isRangeDate ? 'Rango de fechas' : 'Fecha específica'}
                </span>
              </Switch>
            </div>
          </div>

          {/* Filtros de Fecha */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {isRangeDate ? (
              <>
                <Input
                  type="date"
                  label="Fecha de Inicio"
                  value={filters.startDate}
                  onValueChange={(value) => handleFilterChange('startDate', value)}
                  startContent={<CalendarIcon className="w-4 h-4 text-gray-400" />}
                  classNames={{
                    inputWrapper: "bg-white/50 backdrop-blur-sm border-gray-200",
                  }}
                />
                <Input
                  type="date"
                  label="Fecha de Fin"
                  value={filters.endDate}
                  onValueChange={(value) => handleFilterChange('endDate', value)}
                  startContent={<CalendarIcon className="w-4 h-4 text-gray-400" />}
                  classNames={{
                    inputWrapper: "bg-white/50 backdrop-blur-sm border-gray-200",
                  }}
                />
              </>
            ) : (
              <Input
                type="date"
                label="Fecha"
                value={filters.singleDate}
                onValueChange={(value) => handleFilterChange('singleDate', value)}
                startContent={<CalendarIcon className="w-4 h-4 text-gray-400" />}
                classNames={{
                  inputWrapper: "bg-white/50 backdrop-blur-sm border-gray-200",
                }}
              />
            )}
          </div>
        </CardBody>
      </Card>
    </motion.div>
  );
}
