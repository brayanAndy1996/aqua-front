"use client";

import React, { useMemo, useCallback } from "react";
import { User } from "@/types/user";
import useUserList from "@/app/security/users/hooks/useUserList";
import {
  SearchIcon,
  ChevronDownIcon,
  DeleteIcon
} from "@/lib/icons/ui";
import ConfirmationPopUp from "@/components/popUps";
import ModalEditUser from "./ModalEditUser";
import ModalAddUser from "./ModalAddUser";
import ModalAssignRoles from "./ModalAssignRoles";
import glassStyles from "@/app/styles/glassStyles.module.css";
// No need for useSession here as it's used in UserForm

// Using HeroUI components
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  Input,
  Button,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Chip,
  User as UserComponent,
  Pagination,
  Spinner,
} from "@heroui/react";
import { Role } from "@/types/role";


function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export default function UserList() {
  const {
    loading,
    page,
    pages,
    setPageOnChange,
    totalData,
    refreshUsers,
    filterValue,
    onSearchChange,
    sortedItems,
    classNames,
    headerColumns,
    visibleColumns,
    setVisibleColumns,
    statusFilter,
    setStatusFilter,
    sortDescriptor,
    setSortDescriptor,
    columns,
    statusOptions,
    filteredItems,
    setFilterValue,
    statusColorMap,
    handleDeleteUser,
    isLoadingDelete
  } = useUserList();

  const renderCell = useCallback(
    (user: User, columnKey: React.Key) => {
      switch (columnKey) {
        case "name":
          return (
            <UserComponent
              avatarProps={{
                radius: "full",
                size: "sm",
                src: `https://i.pravatar.cc/150?u=${user.id}`,
                name: user.nombre?.charAt(0) || "U",
              }}
              classNames={{
                description: "text-default-500",
              }}
              description={user.email}
              name={
                `${user.nombre || ""} ${user.apellido_paterno || ""}`.trim() 
              }
            >
              {user.email}
            </UserComponent>
          );
        case "email":
          return (
            <div className="flex flex-col">
              <p className="text-bold text-small">{user.email}</p>
            </div>
          );
        case "nombre_completo":
          return (
            <div className="flex flex-col">
              <p className="text-bold text-small">{user.nombre_completo}</p>
            </div>
          );
        case "roles":
          return (
            <div className="flex flex-wrap gap-1">
              {user.roles && user.roles.length > 0 ? (
                user.roles.map((role) => (
                  <Chip 
                    key={role.id} 
                    size="sm" 
                    variant="flat" 
                    color="primary"
                    className="capitalize"
                  >
                    {role.name}
                  </Chip>
                ))
              ) : (
                <Chip size="sm" variant="flat" color="default">
                  Sin roles
                </Chip>
              )}
            </div>
          );
        case "status":
          const status = user.is_active ? "active" : "inactive";
          const statusText = user.is_active ? "Activo" : "Inactivo";
          return (
            <Chip
              className="capitalize border-none gap-1 text-default-600"
              color={statusColorMap[status]}
              size="sm"
              variant="dot"
            >
              {statusText}
            </Chip>
          );
        case "actions":
          return (
            <div className="relative flex items-center gap-2">
              <ModalAssignRoles user={user} refreshUsers={refreshUsers}/>
              <ModalEditUser refreshUsers={refreshUsers} user={user} />
              <ConfirmationPopUp
                icon={<DeleteIcon />}
                tooltipContent="Eliminar Usuario"
                title="¿Eliminar Usuario?"
                message="El usuario se eliminara permanentemente"
                onConfirm={() => handleDeleteUser(user.id || 0)}
                isLoading={isLoadingDelete}
                color="danger"
              />
            </div>
          );
        default:
          const value = user[columnKey as keyof User];
          // Handle any array type (including Role[])
          if (Array.isArray(value)) {
            // If it's roles array
            if (columnKey === 'roles') {
              return (value as Role[]).map(role => role.name).join(', ');
            }
            // For other array types
            return value.join(', ');
          }
          return value;
      }
    },
    [refreshUsers, statusColorMap, handleDeleteUser, isLoadingDelete]
  );

  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            classNames={{
              base: "w-full sm:max-w-[44%]",
              inputWrapper: "border-1",
            }}
            placeholder="Buscar por nombre, nombre completo o email..."
            size="sm"
            startContent={<SearchIcon className="text-default-300" />}
            value={filterValue}
            variant="bordered"
            onClear={() => setFilterValue("")}
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
            <ModalAddUser refreshUsers={refreshUsers} />
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Total {totalData} usuarios
          </span>
        </div>
      </div>
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterValue, statusFilter, visibleColumns, onSearchChange, totalData, statusColorMap,columns]);

  const bottomContent = useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <Pagination
          showControls
          classNames={{
            cursor: "bg-foreground text-background",
          }}
          color="default"
          page={page}
          total={pages}
          variant="light"
          onChange={setPageOnChange}
        />
        <span className="text-small text-default-400">
          {filteredItems.length} usuarios encontrados
        </span>
      </div>
    );
  }, [page, pages, setPageOnChange, filteredItems.length]);

  if (loading) {
    return (
      <div className={`${glassStyles.glassCard} rounded-xl p-6`}>
        <div className="flex justify-center items-center h-64">
          <Spinner size="lg" />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={`${glassStyles.glassCard} rounded-xl p-6`}>
        <Table
          isCompact
          removeWrapper
          aria-label="Tabla de usuarios con celdas personalizadas, paginación y ordenamiento"
          bottomContent={bottomContent}
          bottomContentPlacement="outside"
          classNames={classNames}
          selectionMode="none"
          sortDescriptor={sortDescriptor}
          topContent={topContent}
          topContentPlacement="outside"
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
            items={sortedItems}
          >
            {(item) => (
              <TableRow key={item.id}>
                {(columnKey) => (
                  <TableCell>{renderCell(item, columnKey)}</TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
