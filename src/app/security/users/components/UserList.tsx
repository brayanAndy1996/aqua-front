"use client";

import React, { useCallback, useMemo } from "react";
import { useUserList } from "../hooks/useUserList";
import { User } from "@/types/user";
import { ConditionalRender } from "@/components/auth/ConditionalRender";
import ModalEditUser from "./ModalEditUser";
import ModalAddUser from "./ModalAddUser";
import ModalAssignRoles from "./ModalAssignRoles";
import ResponsiveUserTable from "./ResponsiveUserTable";
import glassStyles from "@/app/styles/glassStyles.module.css";
import {
  Chip,
  User as UserComponent,
  Pagination,
  Spinner,
} from "@heroui/react";
import ConfirmationPopUp from "@/components/popUps";
import {
  DeleteIcon
} from "@/lib/icons/ui";
import { Role } from "@/types/role";

const UserList = () => {
  const {
    loading,
    error,
    totalData,
    page,
    pages,
    filterValue,
    statusFilter,
    visibleColumns,
    sortDescriptor,
    onSearchChange,
    setStatusFilter,
    setVisibleColumns,
    setSortDescriptor,
    setPageOnChange,
    deleteUser,
    isLoadingDelete,
    refreshUsers,
    selectedUser,
    setSelectedUser,
    columns,
    statusOptions,
    statusColorMap,
    headerColumns,
    classNames,
    sortedItems,
  } = useUserList();

  // Funciones para manejar acciones de usuario
  const handleEditUser = useCallback((user: User) => {
    setSelectedUser(user);
  }, [setSelectedUser]);

  const handleDeleteUser = useCallback((userId: number) => {
    deleteUser(userId);
  }, [deleteUser]);

  const handleAssignRoles = useCallback((user: User) => {
    setSelectedUser(user);
  }, [setSelectedUser]);

  const handleClearFilters = useCallback(() => {
    onSearchChange("");
    setStatusFilter("all");
  }, [onSearchChange, setStatusFilter]);

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
          {totalData} usuarios encontrados
        </span>
      </div>
    );
  }, [page, pages, setPageOnChange, totalData]);

  if (loading) {
    return (
      <div className={`${glassStyles.glassCard} rounded-xl p-6`}>
        <div className="flex justify-center items-center h-64">
          <Spinner size="lg" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${glassStyles.glassCard} rounded-xl p-6`}>
        <div className="text-center text-danger">
          Error al cargar usuarios: {error}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={`${glassStyles.glassCard} rounded-xl p-4 lg:p-6`}>
        {/* Tabla Responsive con filtros integrados */}
        <ResponsiveUserTable
          users={sortedItems}
          headerColumns={headerColumns}
          renderCell={renderCell}
          classNames={classNames}
          sortDescriptor={sortDescriptor}
          setSortDescriptor={setSortDescriptor}
          onEditUser={handleEditUser}
          onDeleteUser={handleDeleteUser}
          onAssignRoles={handleAssignRoles}
          statusColorMap={statusColorMap}
          isLoadingDelete={isLoadingDelete}
          filterValue={filterValue}
          onSearchChange={onSearchChange}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          visibleColumns={visibleColumns}
          setVisibleColumns={setVisibleColumns}
          statusOptions={statusOptions}
          columns={columns}
          totalData={totalData}
          onClearFilters={handleClearFilters}
          addUserComponent={<ModalAddUser refreshUsers={refreshUsers} />}
        />

        {/* Paginación */}
        <div className="mt-6">
          {bottomContent}
        </div>
      </div>

      {/* Modales - Los modales manejan su propio estado con useDisclosure */}
      {selectedUser && (
        <>
          <ModalEditUser
            user={selectedUser}
            refreshUsers={refreshUsers}
          />
          <ConditionalRender condition={{ roles: ["Administrador"] }}>
            <ModalAssignRoles
              user={selectedUser}
              refreshUsers={refreshUsers}
            />
          </ConditionalRender>
        </>
      )}
    </>
  );
};

export default UserList;
