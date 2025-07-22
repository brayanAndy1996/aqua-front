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
  Avatar,
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
import { User } from '@/types/user';
import { Role } from '@/types/role';

interface ResponsiveUserTableProps {
  users: User[];
  headerColumns: Array<{uid: string; name: string; sortable?: boolean}>;
  renderCell: (user: User, columnKey: string) => React.ReactNode;
  classNames: Record<string, string[]>;
  sortDescriptor: SortDescriptor;
  setSortDescriptor: (descriptor: SortDescriptor) => void;
  onEditUser: (user: User) => void;
  onDeleteUser: (userId: number) => void;
  onAssignRoles: (user: User) => void;
  statusColorMap: Record<string, "default" | "primary" | "secondary" | "success" | "warning" | "danger" | undefined>;
  isLoadingDelete: boolean;
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
  // Componente para agregar usuario
  addUserComponent?: React.ReactNode;
}

const ResponsiveUserTable: React.FC<ResponsiveUserTableProps> = ({
  users,
  headerColumns,
  renderCell,
  classNames,
  sortDescriptor,
  setSortDescriptor,
  onEditUser,
  onDeleteUser,
  onAssignRoles,
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
  addUserComponent,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  // Función para obtener el color del chip de rol
  const getRoleChipColor = (roleName: string): "default" | "primary" | "secondary" | "success" | "warning" | "danger" => {
    const roleColors: Record<string, "default" | "primary" | "secondary" | "success" | "warning" | "danger"> = {
      'Administrador': 'danger',
      'Entrenador': 'primary',
      'Asistente': 'secondary',
      'Padre': 'success',
      'Estudiante': 'warning'
    };
    return roleColors[roleName] || 'default';
  };

  // Función para obtener el color del chip de estado
  const getStatusChipColor = (status: string): "default" | "primary" | "secondary" | "success" | "warning" | "danger" => {
    return statusColorMap[status] || 'default';
  };

  // TopContent para filtros (similar a ProductList)
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
      <div className="w-full">
        {/* Vista Desktop */}
        <div className="hidden lg:block">
          <div className="flex flex-col gap-4">
            <div className="flex justify-between gap-3 items-end">
              <Input
                isClearable
                className="w-full sm:max-w-[44%]"
                placeholder="Buscar por nombre..."
                startContent={<SearchIcon />}
                value={filterValue}
                onClear={() => onSearchChange("")}
                onValueChange={onSearchChange}
              />
              <div className="flex gap-3">
                <Dropdown>
                  <DropdownTrigger>
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
                  <DropdownTrigger>
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
                        {column.name}
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
                {addUserComponent}
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-default-400 text-small">
                Total {totalData} usuarios
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
              placeholder="Buscar por nombre..."
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
              Total {totalData} usuarios
            </span>
          </div>
          
          {/* Botón Agregar Usuario en móvil */}
          {addUserComponent && (
            <div className="mb-4">
              {addUserComponent}
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
                          {column.name}
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
      </div>
    );
  }, [filterValue, onSearchChange, statusFilter, setStatusFilter, visibleColumns, setVisibleColumns, statusOptions, columns, totalData, onClearFilters, addUserComponent, isOpen, onOpen, onClose]);

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
          aria-label="Tabla de usuarios con celdas personalizadas, paginación y ordenamiento"
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
            emptyContent={"No se encontraron usuarios"}
            items={users}
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
          {users.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-default-500">No se encontraron usuarios</p>
            </div>
          ) : (
            users.map((user) => (
              <Card key={user.id} className="w-full">
                <CardBody className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Avatar
                        name={`${user.nombre || ''} ${user.apellido_paterno || ''}`}
                        size="sm"
                      />
                      <div>
                        <p className="font-semibold text-sm">
                          {user.nombre} {user.apellido_paterno} {user.apellido_materno}
                        </p>
                        <p className="text-xs text-default-500">{user.email}</p>
                      </div>
                    </div>
                    
                    {/* Menú de acciones */}
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
                      <DropdownMenu aria-label="Acciones del usuario">
                        <DropdownItem
                          key="edit"
                          onPress={() => onEditUser(user)}
                        >
                          Editar
                        </DropdownItem>
                        <DropdownItem
                          key="roles"
                          onPress={() => onAssignRoles(user)}
                        >
                          Asignar Roles
                        </DropdownItem>
                        <DropdownItem
                          key="delete"
                          className="text-danger"
                          color="danger"
                          onPress={() => user.id && onDeleteUser(user.id)}
                        >
                          Eliminar
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </div>

                  {/* Información adicional */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-default-500">Estado:</span>
                      <Chip
                        size="sm"
                        variant="flat"
                        color={getStatusChipColor(user.is_active ? 'active' : 'inactive')}
                      >
                        {user.is_active ? 'Activo' : 'Inactivo'}
                      </Chip>
                    </div>
                    
                    {user.roles && user.roles.length > 0 && (
                      <div className="flex items-start justify-between">
                        <span className="text-xs text-default-500">Roles:</span>
                        <div className="flex flex-wrap gap-1 max-w-[60%]">
                          {user.roles.map((role: Role, index: number) => (
                            <Chip
                              key={index}
                              size="sm"
                              variant="flat"
                              color={getRoleChipColor(role.name || '')}
                            >
                              {role.name}
                            </Chip>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {user.nro_documento && (
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-default-500">Documento:</span>
                        <span className="text-xs">{user.nro_documento}</span>
                      </div>
                    )}
                  </div>
                </CardBody>
              </Card>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default ResponsiveUserTable;
