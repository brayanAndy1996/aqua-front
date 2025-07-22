"use client";

import React, { useMemo } from 'react';
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  Card,
  CardBody,
  Chip,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  SortDescriptor,
  Input,
  Selection,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Divider
} from '@heroui/react';
import { MoreVertical, Filter, X } from 'lucide-react';
import { 
  SearchIcon, 
  ChevronDownIcon
} from '@/lib/icons/ui';
import { Product } from '@/types/product';

interface ResponsiveProductTableProps {
  products: Product[];
  headerColumns: Array<{uid: string; name: string; sortable?: boolean}>;
  renderCell: (product: Product, columnKey: string) => React.ReactNode;
  classNames: Record<string, string[]>;
  sortDescriptor: SortDescriptor;
  setSortDescriptor: (descriptor: SortDescriptor) => void;
  statusColorMap: Record<string, "default" | "primary" | "secondary" | "success" | "warning" | "danger" | undefined>;
  // Props para filtros
  filterValue: string;
  onSearchChange: (value: string) => void;
  statusFilter: Selection;
  setStatusFilter: (value: Selection) => void;
  visibleColumns: Selection;
  setVisibleColumns: (value: Selection) => void;
  statusOptions: Array<{uid: string; name: string}>;
  columns: Array<{uid: string; name: string}>;
  totalData: number;
  onClearFilters: () => void;
  // Componente para agregar producto
  addProductComponent?: React.ReactNode;
}

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(amount);
}

const ResponsiveProductTable: React.FC<ResponsiveProductTableProps> = ({
  products,
  headerColumns,
  renderCell,
  classNames,
  sortDescriptor,
  setSortDescriptor,
  statusColorMap,
  filterValue,
  onSearchChange,
  statusFilter,
  setStatusFilter,
  visibleColumns,
  setVisibleColumns,
  statusOptions,
  columns,
  totalData,
  onClearFilters,
  addProductComponent,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Función para obtener el color del chip de estado
  const getStatusChipColor = (status: string): "default" | "primary" | "secondary" | "success" | "warning" | "danger" => {
    return statusColorMap[status] || 'default';
  };

  // TopContent para filtros (similar a ProductList original)
  const topContent = useMemo(() => {
    // Función para obtener el texto del filtro de estado
    const getStatusFilterText = () => {
      if (statusFilter === "all") return "Todos los estados";
      if (statusFilter instanceof Set) {
        return statusFilter.size === 1 ? "1 seleccionado" : `${statusFilter.size} seleccionados`;
      }
      return "Todos los estados";
    };

    // Función para obtener el texto del filtro de columnas
    const getColumnsFilterText = () => {
      if (visibleColumns === "all") return "Todas las columnas";
      if (visibleColumns instanceof Set) {
        return visibleColumns.size === 1 ? "1 seleccionada" : `${visibleColumns.size} seleccionadas`;
      }
      return "Todas las columnas";
    };
    
    return (
      <>
        {/* Vista Desktop */}
        <div className="hidden lg:block">
          <div className="flex flex-col gap-4">
            <div className="flex justify-between gap-3 items-end">
              <Input
                isClearable
                classNames={{
                  base: "w-full sm:max-w-[44%]",
                  inputWrapper: "border-1",
                }}
                aria-label="Buscar por código o nombre"
                placeholder="Buscar por código o nombre..."
                size="sm"
                startContent={<SearchIcon className="text-default-300" />}
                value={filterValue}
                variant="bordered"
                onClear={() => onSearchChange("")}
                onValueChange={onSearchChange}
              />
              <div className="flex gap-3">
                <Dropdown>
                  <DropdownTrigger className="hidden sm:flex">
                    <Button
                      endContent={<ChevronDownIcon className="text-small" />}
                      size="sm"
                      variant="flat"
                    >
                      Estado
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu
                    disallowEmptySelection
                    aria-label="Filtro de Estado"
                    closeOnSelect={false}
                    selectedKeys={statusFilter}
                    selectionMode="multiple"
                    onSelectionChange={setStatusFilter}
                  >
                    {statusOptions.map((status) => (
                      <DropdownItem key={status.uid} className="capitalize">
                        {status.name}
                      </DropdownItem>
                    ))}
                  </DropdownMenu>
                </Dropdown>
                <Dropdown>
                  <DropdownTrigger className="hidden sm:flex">
                    <Button
                      endContent={<ChevronDownIcon className="text-small" />}
                      size="sm"
                      variant="flat"
                    >
                      Columnas
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu
                    disallowEmptySelection
                    aria-label="Columnas de la Tabla"
                    closeOnSelect={false}
                    selectedKeys={visibleColumns}
                    selectionMode="multiple"
                    onSelectionChange={setVisibleColumns}
                  >
                    {columns.map((column) => (
                      <DropdownItem key={column.uid} className="capitalize">
                        {capitalize(column.name)}
                      </DropdownItem>
                    ))}
                  </DropdownMenu>
                </Dropdown>
                <Button
                  color="danger"
                  variant="light"
                  onPress={onClearFilters}
                  startContent={<X className="h-4 w-4" />}
                  size="sm"
                >
                  Limpiar
                </Button>
                {addProductComponent}
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-default-400 text-small">
                Total {totalData} productos
              </span>
            </div>
          </div>
        </div>

        {/* Vista Móvil */}
        <div className="block lg:hidden">
          <div className="flex gap-2 items-center mb-4">
            <Input
              isClearable
              className="flex-1"
              placeholder="Buscar por código o nombre..."
              startContent={<SearchIcon />}
              value={filterValue}
              onClear={() => onSearchChange("")}
              onValueChange={onSearchChange}
            />
            <Button
              isIconOnly
              size="sm"
              variant="flat"
              onPress={onOpen}
            >
              <Filter className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex justify-between items-center mb-2">
            <span className="text-default-400 text-small">
              Total {totalData} productos
            </span>
          </div>
          
          {/* Botón Agregar Producto en móvil */}
          {addProductComponent && (
            <div className="mb-4">
              {addProductComponent}
            </div>
          )}
        </div>

        {/* Modal de Filtros para Móvil */}
        <Modal isOpen={isOpen} onClose={onClose} placement="center">
          <ModalContent>
            <ModalHeader>
              <div className="flex items-center justify-between w-full">
                <h3>Filtros</h3>
              </div>
            </ModalHeader>
            <ModalBody>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Estado</h4>
                  <Dropdown>
                    <DropdownTrigger>
                      <Button
                        variant="flat"
                        className="w-full justify-between"
                        endContent={<ChevronDownIcon />}
                      >
                        {getStatusFilterText()}
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu
                      disallowEmptySelection
                      aria-label="Filtro de Estado"
                      closeOnSelect={false}
                      selectedKeys={statusFilter}
                      selectionMode="multiple"
                      onSelectionChange={setStatusFilter}
                    >
                      {statusOptions.map((status) => (
                        <DropdownItem key={status.uid} className="capitalize">
                          {status.name}
                        </DropdownItem>
                      ))}
                    </DropdownMenu>
                  </Dropdown>
                </div>

                <Divider />

                <div>
                  <h4 className="text-sm font-medium mb-2">Columnas Visibles</h4>
                  <Dropdown>
                    <DropdownTrigger>
                      <Button
                        variant="flat"
                        className="w-full justify-between"
                        endContent={<ChevronDownIcon />}
                      >
                        {getColumnsFilterText()}
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu
                      disallowEmptySelection
                      aria-label="Columnas de la Tabla"
                      closeOnSelect={false}
                      selectedKeys={visibleColumns}
                      selectionMode="multiple"
                      onSelectionChange={setVisibleColumns}
                    >
                      {columns.map((column) => (
                        <DropdownItem key={column.uid} className="capitalize">
                          {capitalize(column.name)}
                        </DropdownItem>
                      ))}
                    </DropdownMenu>
                  </Dropdown>
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button
                color="danger"
                variant="light"
                onPress={() => {
                  onClearFilters();
                  onClose();
                }}
                className="flex-1"
                startContent={<X className="h-4 w-4" />}
              >
                Limpiar Filtros
              </Button>
              <Button
                color="primary"
                onPress={onClose}
                className="flex-1"
              >
                Aplicar
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    );
  }, [filterValue, onSearchChange, statusFilter, setStatusFilter, visibleColumns, setVisibleColumns, statusOptions, columns, totalData, onClearFilters, addProductComponent, isOpen, onOpen, onClose]);

  return (
    <>
      {/* Filtros - Visible en ambas vistas */}
      <div className="mb-6">
        {topContent}
      </div>

      {/* Vista Desktop - Tabla */}
      <div className="hidden lg:block">
        <Table
          isCompact
          removeWrapper
          aria-label="Tabla de productos con celdas personalizadas, paginación y ordenamiento"
          classNames={classNames}
          selectionMode="none"
          sortDescriptor={sortDescriptor}
          onSortChange={setSortDescriptor}
        >
          <TableHeader columns={headerColumns}>
            {(column) => (
              <TableColumn
                key={column.uid}
                align={column.uid === "actions" ? "center" : "start"}
                allowsSorting={column.sortable}
              >
                {column.name}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody
            emptyContent={"No se encontraron productos"}
            items={products}
          >
            {(item) => (
              <TableRow key={item.id}>
                {(columnKey) => (
                  <TableCell>{renderCell(item, columnKey as string)}</TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Vista Móvil - Cards */}
      <div className="block lg:hidden">
        <div className="space-y-4">
          {products.map((product) => (
            <Card key={product.id} className="w-full">
              <CardBody className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <div className="flex flex-col gap-1">
                      <p className="text-sm font-semibold text-foreground">
                        {product.name}
                      </p>
                      <p className="text-xs text-default-500">
                        Código: {product.code}
                      </p>
                    </div>
                  </div>
                  <Dropdown>
                    <DropdownTrigger>
                      <Button
                        isIconOnly
                        size="sm"
                        variant="light"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu aria-label="Acciones del producto">
                      <DropdownItem key="edit">
                        Editar
                      </DropdownItem>
                      <DropdownItem key="stock">
                        Agregar Stock
                      </DropdownItem>
                      <DropdownItem key="delete" className="text-danger" color="danger">
                        Eliminar
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-default-500">Precio:</span>
                    <span className="text-sm font-medium">
                      {formatCurrency(product.sale_price)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-default-500">Stock:</span>
                    <Chip
                      size="sm"
                      color={product.current_stock <= product.min_stock ? "danger" : "success"}
                      variant="flat"
                    >
                      {product.current_stock}
                    </Chip>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-xs text-default-500">Estado:</span>
                    <Chip
                      size="sm"
                      color={getStatusChipColor(product.is_active ? "active" : "inactive")}
                      variant="flat"
                    >
                      {product.is_active ? "Activo" : "Inactivo"}
                    </Chip>
                  </div>

                  {product.description && (
                    <div className="mt-2">
                      <p className="text-xs text-default-500 line-clamp-2">
                        {product.description}
                      </p>
                    </div>
                  )}
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
};

export default ResponsiveProductTable;
