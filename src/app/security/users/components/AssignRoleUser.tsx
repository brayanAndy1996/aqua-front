import { Checkbox, CheckboxGroup } from "@heroui/react";
import { getRoleIconByName } from "@/lib/icons/roles";
import { User } from "@/types/user";
import { useAssignRoleUser } from "../hooks/useAssignRoleUser";
import { Button } from "@heroui/react";

const AssignRoleUser = ({
  user,
  onClose,
  onSuccess,
  hideButtons = false,
  onRolesChange,
  initialSelectedRoles = [],
}: {
  user: User;
  onClose: () => void;
  onSuccess: () => void;
  hideButtons?: boolean;
  onRolesChange?: (roles: string[]) => void;
  initialSelectedRoles?: string[];
}) => {
  const {
    roles,
    user: userData,
    selectedRoles,
    loading,
    handleRoleChange,
    handleSubmit,
  } = useAssignRoleUser({ user, onSuccess, initialSelectedRoles });

  const handleRoleChangeWrapper = (values: string[]) => {
    handleRoleChange(values);
    if (onRolesChange) {
      onRolesChange(values);
    }
  };

  const fullName = userData
    ? `${userData.nombre} ${userData.apellido_paterno} ${userData.apellido_materno}`
    : "Cargando...";

  return (
    <div>
      <div className="mb-4">
        <p className="text-sm text-gray-500 dark:text-gray-400">{fullName}</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
        </div>
      ) : (
        <>
          <CheckboxGroup
            value={selectedRoles}
            onValueChange={handleRoleChangeWrapper}
            classNames={{
              base: "gap-4",
            }}
          >
            {roles.map((role) => (
              <Checkbox
                key={role.id.toString()}
                value={role.id.toString()}
                classNames={{
                  base: "max-w-full",
                  label: "flex items-center gap-4",
                }}
              >
                <div className="flex items-center gap-4">
                  <div className="bg-primary-100 dark:bg-primary-900 p-2 rounded-full">
                    {(() => {
                      const IconComponent = getRoleIconByName(
                        role.icon || "shield"
                      );
                      return (
                        <IconComponent className="text-primary-500" size={20} />
                      );
                    })()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {role.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {role.description}
                    </p>
                  </div>
                </div>
              </Checkbox>
            ))}
          </CheckboxGroup>

          {!hideButtons && (
            <div className="flex justify-end mt-16 gap-4">
              <Button color="danger" variant="ghost" onPress={onClose}>
                Cancelar
              </Button>
              <Button color="primary" variant="ghost" onPress={handleSubmit} isLoading={loading}>
                Guardar Cambios
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AssignRoleUser;
