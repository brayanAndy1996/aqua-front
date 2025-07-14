"use client";
import type {RangeValue} from "@react-types/shared";
import type {DateValue} from "@react-types/datepicker";
import {parseDate} from "@internationalized/date";
import { motion } from 'framer-motion';
import { 
  Autocomplete, 
  AutocompleteItem, 
  Select, 
  SelectItem, 
  DateRangePicker, 
  Button,
  Card,
  CardBody
} from '@heroui/react';
import { MagnifyingGlassIcon, UserIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { ReportFiltersProps } from '@/types/report';
import useReportFilters from "../hooks/useReportFilters";
import dayjs from 'dayjs';

export default function ReportFilters({ filters, onFiltersChange, type }: ReportFiltersProps) {
  const [value, setValue] = useState<RangeValue<DateValue> | null>({
    start: parseDate(filters.startDate),
    end: parseDate(filters.endDate),
  });
  const [filtersProducts, setfiltersProducts] = useState({
    productCode: '',
    productName: ''
  })
  const { users, products, productsLoading } = useReportFilters(filtersProducts);
  const handleFilterChange = (key: string, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      productId: null,
      startDate: dayjs().startOf('month').format('YYYY-MM-DD'),
      endDate: dayjs().format('YYYY-MM-DD'),
      userId: null
    });
    setfiltersProducts({
      productCode: '',
      productName: ''
    })
    setValue({
      start: parseDate(dayjs().startOf('month').format('YYYY-MM-DD')),
      end: parseDate(dayjs().format('YYYY-MM-DD'))
    })
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
            <Select
              label="Usuario"
              placeholder="Seleccionar usuario"
              startContent={<UserIcon className="w-4 h-4 text-gray-400" />}
              classNames={{
                trigger: "bg-white/50 backdrop-blur-sm border-gray-200",
              }}
              selectedKeys={filters.userId ? [filters.userId] : []}
              onSelectionChange={(keys) => {
                const selectedKey = Array.from(keys)[0] as string;
                handleFilterChange('userId', selectedKey || '');
              }}
            >
              {users.map((user) => (
                <SelectItem key={user.id}>
                  {user.nombre_completo}
                </SelectItem>
              ))}
            </Select>

            <Autocomplete
              label="Nombre del Producto"
              placeholder="Buscar por nombre..."
              startContent={<MagnifyingGlassIcon className="w-4 h-4 text-gray-400" />}
              isLoading={productsLoading}
              isDisabled={filtersProducts.productCode.length > 0}
              inputValue={filtersProducts.productName || ''}
              items={products || []}
              onInputChange={(value) => setfiltersProducts((prev) => ({ ...prev, productName: value }))}
              onSelectionChange={(keys) => {
                const productSelect = products?.find((product) => product.id === Number(keys))
                handleFilterChange('productId', productSelect?.id?.toString() || '');
              }}
            >
               {(item) => (
                <AutocompleteItem key={item.id} className="capitalize">
                  {item.name}
                </AutocompleteItem>
              )}
            </Autocomplete>

            <Autocomplete
              label="Código del Producto"
              placeholder="Buscar por código..."
              inputValue={filtersProducts.productCode || ''}
              startContent={<MagnifyingGlassIcon className="w-4 h-4 text-gray-400" />}
              isDisabled={filtersProducts.productName.length > 0}
              isLoading={productsLoading}
              items={products || []}
              onInputChange={(value) => setfiltersProducts((prev) => ({ ...prev, productCode: value }))}
              onSelectionChange={(keys) => {
                const productSelect = products?.find((product) => product.id === Number(keys))
                handleFilterChange('productId', productSelect?.id?.toString() || '');
              }}
            >
              {(item) => (
                <AutocompleteItem key={item.id} className="capitalize">
                  {item.code}
                </AutocompleteItem>
              )}
            </Autocomplete>
            <DateRangePicker
              aria-label="Seleccionar fecha"
              label="Fecha"
              visibleMonths={2}
              value={value} 
              onChange={(newValue) => {
                setValue(newValue);
                if (newValue) {
                  const startDateStr = newValue.start?.toString();
                  const endDateStr = newValue.end?.toString();
                  
                  onFiltersChange({
                    ...filters,
                    startDate: startDateStr || '',
                    endDate: endDateStr || ''
                  });
                } else {
                  onFiltersChange({
                    ...filters,
                    startDate: '',
                    endDate: ''
                  });
                }
              }}
              classNames={{
                base: "bg-white/50 backdrop-blur-sm",
              }}
            />
          </div>
        </CardBody>
      </Card>
    </motion.div>
  );
}
