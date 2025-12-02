"use client";

import React, { useState } from "react";
import { UserRound, Briefcase, Mail, Phone, Building2, Plus } from "lucide-react";

type UserRole = "admin" | "driver" | "passenger" | "corporate";
type UserStatus = "activo" | "inactivo" | "pendiente";

type AdminUserRow = {
  id: number;
  fullName: string;
  document: string;
  email: string;
  phone: string;
  role: UserRole;
  company?: string;
  status: UserStatus;
};

const MOCK_USERS: AdminUserRow[] = [
  {
    id: 1,
    fullName: "Carlos Ramírez",
    document: "DNI 12345678",
    email: "carlos.ramirez@empresa.com",
    phone: "+51 999 111 222",
    role: "driver",
    company: "Transporte Sur S.A.",
    status: "activo",
  },
  {
    id: 2,
    fullName: "Lucía Fernández",
    document: "DNI 87654321",
    email: "lucia.fernandez@cliente.com",
    phone: "+51 988 222 333",
    role: "corporate",
    company: "Planta Sur - Cliente",
    status: "activo",
  },
  {
    id: 3,
    fullName: "Admin General",
    document: "DNI 44556677",
    email: "admin@sistema.com",
    phone: "+51 955 333 444",
    role: "admin",
    status: "activo",
  },
  {
    id: 4,
    fullName: "José Pérez",
    document: "DNI 55443322",
    email: "jose.perez@empresa.com",
    phone: "+51 977 444 555",
    role: "driver",
    company: "Transporte Norte SAC",
    status: "pendiente",
  },
  {
    id: 5,
    fullName: "Ana Torres",
    document: "DNI 99887766",
    email: "ana.torres@correo.com",
    phone: "+51 966 555 666",
    role: "passenger",
    company: "Planta Sur - Colaboradora",
    status: "inactivo",
  },
];

export default function AdminUsersPage() {
  const [roleFilter, setRoleFilter] = useState<UserRole | "all">("all");
  const [statusFilter, setStatusFilter] = useState<UserStatus | "all">("all");
  const [search, setSearch] = useState("");

  const [users] = useState<AdminUserRow[]>(MOCK_USERS);

  const filteredUsers = users.filter((u) => {
    const matchRole = roleFilter === "all" || u.role === roleFilter;
    const matchStatus = statusFilter === "all" || u.status === statusFilter;
    const matchSearch =
      !search ||
      u.fullName.toLowerCase().includes(search.toLowerCase()) ||
      u.document.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    return matchRole && matchStatus && matchSearch;
  });

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case "admin":
        return "Administrador";
      case "driver":
        return "Conductor";
      case "passenger":
        return "Pasajero";
      case "corporate":
        return "Cliente corporativo";
    }
  };

  const getStatusBadge = (status: UserStatus) => {
    const base =
      "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium";
    switch (status) {
      case "activo":
        return (
          <span className={`${base} bg-emerald-500/10 text-emerald-300`}>Activo</span>
        );
      case "inactivo":
        return <span className={`${base} bg-slate-500/15 text-slate-300`}>Inactivo</span>;
      case "pendiente":
        return (
          <span className={`${base} bg-amber-500/10 text-amber-300`}>Pendiente</span>
        );
    }
  };

  return (
    <div className="flex h-full min-h-0 flex-col gap-4 pb-16 md:pb-6">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-lg font-semibold tracking-tight sm:text-xl">
          Usuarios del sistema
        </h1>
        <p className="max-w-xl text-xs text-slate-400 sm:text-sm">
          Registra y administra conductores, pasajeros, clientes corporativos y
          administradores de la plataforma.
        </p>
      </div>

      {/* Filtros + acciones */}
      <section className="flex flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-950/80 p-3 text-xs shadow-sm sm:p-4">
        <div className="grid gap-3 md:grid-cols-[1.4fr,1fr,1fr]">
          {/* Búsqueda */}
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-medium text-slate-400">
              Buscar usuario
            </label>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Nombre, documento o correo"
              className="w-full rounded-md border border-slate-700 bg-slate-900 px-2 py-1.5 text-[16px] leading-tight text-slate-100 ring-0 outline-none placeholder:text-slate-500 focus:border-emerald-500 sm:text-xs"
            />
          </div>

          {/* Rol */}
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-medium text-slate-400">
              Tipo de usuario
            </label>
            <select
              value={roleFilter}
              onChange={(e) =>
                setRoleFilter(
                  e.target.value === "all" ? "all" : (e.target.value as UserRole)
                )
              }
              className="w-full rounded-md border border-slate-700 bg-slate-900 px-2 py-1.5 text-[16px] leading-tight text-slate-100 ring-0 outline-none focus:border-emerald-500 sm:text-xs"
            >
              <option value="all">Todos</option>
              <option value="admin">Administradores</option>
              <option value="driver">Conductores</option>
              <option value="passenger">Pasajeros</option>
              <option value="corporate">Clientes corporativos</option>
            </select>
          </div>

          {/* Estado */}
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-medium text-slate-400">Estado</label>
            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(
                  e.target.value === "all" ? "all" : (e.target.value as UserStatus)
                )
              }
              className="w-full rounded-md border border-slate-700 bg-slate-900 px-2 py-1.5 text-[16px] leading-tight text-slate-100 ring-0 outline-none focus:border-emerald-500 sm:text-xs"
            >
              <option value="all">Todos</option>
              <option value="activo">Activos</option>
              <option value="pendiente">Pendientes</option>
              <option value="inactivo">Inactivos</option>
            </select>
          </div>
        </div>

        <div className="mt-1 flex flex-col gap-2 sm:mt-2 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={() => console.log("Abrir formulario de registro...")}
            className="inline-flex items-center justify-center gap-1.5 rounded-md bg-emerald-500 px-3 py-1.5 text-[13px] font-semibold text-emerald-950 hover:bg-emerald-400 sm:text-[11px]"
          >
            <Plus className="h-4 w-4" />
            Registrar usuario
          </button>

          <p className="text-[11px] text-slate-500">
            RF01 – Usuarios: conductores, pasajeros, empresas afiliadas y administradores.
          </p>
        </div>
      </section>

      {/* Lista de usuarios */}
      <section className="flex flex-1 flex-col rounded-2xl border border-slate-800 bg-slate-950/80 p-3 text-xs shadow-sm sm:p-4">
        <div className="mb-2 flex items-center justify-between gap-2">
          <h2 className="text-sm font-semibold text-slate-50">Usuarios registrados</h2>
          <span className="text-[11px] text-slate-400">
            {filteredUsers.length} usuario(s) encontrados
          </span>
        </div>

        {/* Vista cards en móvil */}
        <div className="space-y-2 md:hidden">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((u) => (
              <div
                key={u.id}
                className="rounded-xl border border-slate-800 bg-slate-950/80 p-3 text-[11px]"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2">
                    <div className="mt-0.5 rounded-full bg-slate-900 p-1.5">
                      <UserRound className="h-4 w-4 text-emerald-300" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-slate-50">
                        {u.fullName}
                      </div>
                      <div className="text-[10px] text-slate-400">{u.document}</div>
                    </div>
                  </div>
                  {getStatusBadge(u.status)}
                </div>

                <div className="mt-2 grid gap-1 text-[10px] text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <Mail className="h-3 w-3 text-slate-500" />
                    <span className="truncate">{u.email}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Phone className="h-3 w-3 text-slate-500" />
                    <span>{u.phone}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Briefcase className="h-3 w-3 text-slate-500" />
                    <span>{getRoleLabel(u.role)}</span>
                  </div>
                  {u.company && (
                    <div className="flex items-center gap-1.5">
                      <Building2 className="h-3 w-3 text-slate-500" />
                      <span className="truncate">{u.company}</span>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-[11px] text-slate-400">
              No hay usuarios para los filtros seleccionados.
            </p>
          )}
        </div>

        {/* Tabla en desktop */}
        <div className="hidden flex-1 overflow-auto md:block">
          {filteredUsers.length > 0 ? (
            <table className="min-w-full border-separate border-spacing-0 text-[11px]">
              <thead>
                <tr className="bg-slate-900/80 text-slate-400">
                  <th className="border-b border-slate-800 px-2 py-1.5 text-left font-medium">
                    Usuario
                  </th>
                  <th className="border-b border-slate-800 px-2 py-1.5 text-left font-medium">
                    Documento
                  </th>
                  <th className="border-b border-slate-800 px-2 py-1.5 text-left font-medium">
                    Correo
                  </th>
                  <th className="border-b border-slate-800 px-2 py-1.5 text-left font-medium">
                    Teléfono
                  </th>
                  <th className="border-b border-slate-800 px-2 py-1.5 text-left font-medium">
                    Rol
                  </th>
                  <th className="border-b border-slate-800 px-2 py-1.5 text-left font-medium">
                    Empresa / Cliente
                  </th>
                  <th className="border-b border-slate-800 px-2 py-1.5 text-left font-medium">
                    Estado
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-900/60">
                    <td className="border-b border-slate-900 px-2 py-1.5 text-slate-100">
                      {u.fullName}
                    </td>
                    <td className="border-b border-slate-900 px-2 py-1.5 text-slate-300">
                      {u.document}
                    </td>
                    <td className="border-b border-slate-900 px-2 py-1.5 text-slate-200">
                      {u.email}
                    </td>
                    <td className="border-b border-slate-900 px-2 py-1.5 text-slate-200">
                      {u.phone}
                    </td>
                    <td className="border-b border-slate-900 px-2 py-1.5 text-slate-200">
                      {getRoleLabel(u.role)}
                    </td>
                    <td className="border-b border-slate-900 px-2 py-1.5 text-slate-200">
                      {u.company || "-"}
                    </td>
                    <td className="border-b border-slate-900 px-2 py-1.5">
                      {getStatusBadge(u.status)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-[11px] text-slate-400">
              No hay usuarios para los filtros seleccionados.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
