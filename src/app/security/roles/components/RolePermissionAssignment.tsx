"use client";

import { useState, useEffect } from "react";

interface Role {
  id: number;
  name: string;
}

interface Permission {
  id: number;
  name: string;
  description: string;
}

interface RolePermissionAssignmentProps {
  cls: {
    glassCard: string;
    glassHeader: string;
  };
}

export default function RolePermissionAssignment({ cls }: RolePermissionAssignmentProps) {
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);
  const [rolePermissions, setRolePermissions] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // Helpers --------------------------------------------------
  const fetchRoles = async () => {
    try {
      const res = await fetch("/api/roles/traer-roles");
      if (!res.ok) throw new Error("Error obteniendo roles");
      const data = await res.json();
      setRoles(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchPermissions = async () => {
    try {
      const res = await fetch("/api/permissions/traer-permisos");
      if (!res.ok) throw new Error("Error obteniendo permisos");
      const data = await res.json();
      setPermissions(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchRolePermissions = async (roleId: number) => {
    try {
      const res = await fetch(`/api/roles/traer-rol/${roleId}`);
      if (!res.ok) throw new Error("Error obteniendo permisos del rol");
      const data = await res.json();
      // we assume backend returns { permissions: Permission[] } or permission ids; normalise to ids array
      const ids: number[] = (data.permissions || []).map((p: Permission | number) =>
        typeof p === "number" ? p : p.id
      );
      setRolePermissions(ids);
    } catch (err) {
      console.error(err);
      setRolePermissions([]);
    }
  };

  //----------------------------------------------------------
  useEffect(() => {
    fetchRoles();
    fetchPermissions();
  }, []);

  useEffect(() => {
    if (selectedRoleId !== null) {
      fetchRolePermissions(selectedRoleId);
    }
  }, [selectedRoleId]);

  const handleTogglePermission = (permId: number) => {
    setRolePermissions((prev) =>
      prev.includes(permId) ? prev.filter((id) => id !== permId) : [...prev, permId]
    );
  };

  const handleSave = async () => {
    if (selectedRoleId === null) return;
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      // For simplicity, send the whole array to backend (replace strategy)
      const res = await fetch("/api/roles/assign-permission", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ roleId: selectedRoleId, permissionIds: rolePermissions }),
      });
      if (!res.ok) throw new Error("Error guardando permisos");
      setMessage("Permisos actualizados correctamente");
    } catch (err) {
      console.error(err);
      setMessage("No se pudieron actualizar los permisos");
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(null), 4000);
    }
  };

  return (
    <div className={`${cls.glassCard} rounded-xl p-6`}>
      <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        🔑 Asignar Permisos a Rol
      </h2>

      {/* Select Role */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Seleccione un Rol</label>
        <select
          className="w-full px-3 py-2 border rounded-lg bg-white/80"
          value={selectedRoleId ?? ""}
          onChange={(e) => setSelectedRoleId(Number(e.target.value) || null)}
        >
          <option value="">-- Seleccione --</option>
          {roles.map((role) => (
            <option key={role.id} value={role.id}>
              {role.name}
            </option>
          ))}
        </select>
      </div>

      {/* Permissions list */}
      {selectedRoleId && (
        <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
          {permissions.map((perm) => (
            <label key={perm.id} className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={rolePermissions.includes(perm.id)}
                onChange={() => handleTogglePermission(perm.id)}
              />
              <span className="text-gray-800">
                <strong>{perm.name}</strong> – {perm.description}
              </span>
            </label>
          ))}
        </div>
      )}

      {/* Actions */}
      {selectedRoleId && (
        <div className="flex justify-end gap-4 mt-6">
          <button
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            onClick={() => setSelectedRoleId(null)}
          >
            Cancelar
          </button>
          <button
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? "Guardando..." : "Guardar"}
          </button>
        </div>
      )}

      {message && (
        <p className="mt-4 text-center text-sm text-green-700 bg-green-100 border border-green-200 py-2 rounded-lg">
          {message}
        </p>
      )}
    </div>
  );
}
