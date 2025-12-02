"use client";

import React, { useState } from "react";
import RoutesMap, { RoutePoint } from "@/components/RoutesMap";
import { BusFront, Activity, PauseCircle, WifiOff, Clock3 } from "lucide-react";

type VehicleStatus = "en_servicio" | "detenido" | "sin_senal";

type VehicleRow = {
  id: number;
  code: string;
  plate: string;
  driverName: string;
  routeName: string;
  lat: number;
  lng: number;
  speedKmH: number;
  status: VehicleStatus;
  lastUpdate: string; // HH:mm
};

const MOCK_ROUTES = [
  { id: 1, name: "Ruta Planta Sur - Turno Mañana" },
  { id: 2, name: "Ruta Planta Norte - Turno Noche" },
];

const MOCK_VEHICLES: VehicleRow[] = [
  {
    id: 1,
    code: "UNI-01",
    plate: "ABC-123",
    driverName: "Carlos Ramírez",
    routeName: "Ruta Planta Sur - Turno Mañana",
    lat: -12.045,
    lng: -77.03,
    speedKmH: 38,
    status: "en_servicio",
    lastUpdate: "06:52",
  },
  {
    id: 2,
    code: "UNI-02",
    plate: "DEF-456",
    driverName: "José Pérez",
    routeName: "Ruta Planta Sur - Turno Mañana",
    lat: -12.052,
    lng: -77.05,
    speedKmH: 0,
    status: "detenido",
    lastUpdate: "06:49",
  },
  {
    id: 3,
    code: "UNI-03",
    plate: "GHI-789",
    driverName: "Ana Torres",
    routeName: "Ruta Planta Norte - Turno Noche",
    lat: -12.065,
    lng: -77.04,
    speedKmH: 52,
    status: "en_servicio",
    lastUpdate: "21:12",
  },
  {
    id: 4,
    code: "UNI-04",
    plate: "JKL-321",
    driverName: "Pedro López",
    routeName: "Ruta Planta Norte - Turno Noche",
    lat: -12.04,
    lng: -77.06,
    speedKmH: 0,
    status: "sin_senal",
    lastUpdate: "20:40",
  },
];

export default function AdminMapPage() {
  const [routeFilter, setRouteFilter] = useState<number | "all">("all");
  const [statusFilter, setStatusFilter] = useState<VehicleStatus | "all">("all");
  const [search, setSearch] = useState("");

  const filteredVehicles = MOCK_VEHICLES.filter((v) => {
    const matchRoute =
      routeFilter === "all" ||
      v.routeName === MOCK_ROUTES.find((r) => r.id === routeFilter)?.name;
    const matchStatus = statusFilter === "all" || v.status === statusFilter;
    const matchSearch =
      !search ||
      v.code.toLowerCase().includes(search.toLowerCase()) ||
      v.plate.toLowerCase().includes(search.toLowerCase()) ||
      v.driverName.toLowerCase().includes(search.toLowerCase());
    return matchRoute && matchStatus && matchSearch;
  });

  const pointsForMap: RoutePoint[] = filteredVehicles.map((v) => ({
    id: v.id,
    lat: v.lat,
    lng: v.lng,
    label: v.plate, // 👈 texto encima del punto
    status: v.status, // 👈 colorea el círculo
  }));

  const getStatusBadge = (status: VehicleStatus) => {
    const base =
      "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium";
    switch (status) {
      case "en_servicio":
        return (
          <span className={`${base} bg-emerald-500/10 text-emerald-300`}>
            <Activity className="h-3 w-3" />
            En servicio
          </span>
        );
      case "detenido":
        return (
          <span className={`${base} bg-amber-500/10 text-amber-300`}>
            <PauseCircle className="h-3 w-3" />
            Detenido
          </span>
        );
      case "sin_senal":
        return (
          <span className={`${base} bg-slate-500/15 text-slate-300`}>
            <WifiOff className="h-3 w-3" />
            Sin señal
          </span>
        );
    }
  };

  const onlineCount = MOCK_VEHICLES.filter((v) => v.status === "en_servicio").length;
  const stoppedCount = MOCK_VEHICLES.filter((v) => v.status === "detenido").length;
  const offlineCount = MOCK_VEHICLES.filter((v) => v.status === "sin_senal").length;

  return (
    <div className="flex h-full min-h-0 flex-col gap-4 pb-16 md:pb-6">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-lg font-semibold tracking-tight sm:text-xl">
          Unidades en mapa
        </h1>
        <p className="max-w-xl text-xs text-slate-400 sm:text-sm">
          Visualiza en tiempo casi real la ubicación de los vehículos asignados a rutas de
          transporte de personal (demo con datos simulados).
        </p>
      </div>

      <div className="grid flex-1 gap-4 md:grid-cols-[2fr,1fr]">
        {/* Columna izquierda: mapa + resumen rápido */}
        <section className="flex flex-col gap-3">
          <div className="min-h-[260px] flex-1 overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/80">
            <RoutesMap points={pointsForMap} />
          </div>

          {/* Resumen / leyenda de estados */}
          <div className="grid gap-2 rounded-2xl border border-slate-800 bg-slate-950/90 p-3 text-[11px] sm:grid-cols-3">
            <div className="flex items-center justify-between gap-2 rounded-xl bg-slate-950 px-3 py-2">
              <div className="space-y-0.5">
                <p className="text-[10px] text-slate-400">En servicio</p>
                <p className="text-sm font-semibold text-emerald-300">{onlineCount}</p>
              </div>
              <Activity className="h-4 w-4 text-emerald-300" />
            </div>
            <div className="flex items-center justify-between gap-2 rounded-xl bg-slate-950 px-3 py-2">
              <div className="space-y-0.5">
                <p className="text-[10px] text-slate-400">Detenidas</p>
                <p className="text-sm font-semibold text-amber-300">{stoppedCount}</p>
              </div>
              <PauseCircle className="h-4 w-4 text-amber-300" />
            </div>
            <div className="flex items-center justify-between gap-2 rounded-xl bg-slate-950 px-3 py-2">
              <div className="space-y-0.5">
                <p className="text-[10px] text-slate-400">Sin señal</p>
                <p className="text-sm font-semibold text-slate-300">{offlineCount}</p>
              </div>
              <WifiOff className="h-4 w-4 text-slate-400" />
            </div>
          </div>
        </section>

        {/* Columna derecha: lista de unidades */}
        <section className="flex min-w-[260px] flex-col gap-3">
          {/* Filtros */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-3 text-xs shadow-sm sm:p-4">
            <div className="mb-3 text-sm font-semibold text-slate-50">
              Filtros de unidades
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {/* Ruta */}
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-medium text-slate-400">Ruta</label>
                <select
                  value={routeFilter}
                  onChange={(e) =>
                    setRouteFilter(
                      e.target.value === "all" ? "all" : Number(e.target.value)
                    )
                  }
                  className="w-full rounded-md border border-slate-700 bg-slate-900 px-2 py-1.5 text-[16px] leading-tight text-slate-100 ring-0 outline-none focus:border-emerald-500 sm:text-xs"
                >
                  <option value="all">Todas las rutas</option>
                  {MOCK_ROUTES.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Estado */}
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-medium text-slate-400">Estado</label>
                <select
                  value={statusFilter}
                  onChange={(e) =>
                    setStatusFilter(
                      e.target.value === "all" ? "all" : (e.target.value as VehicleStatus)
                    )
                  }
                  className="w-full rounded-md border border-slate-700 bg-slate-900 px-2 py-1.5 text-[16px] leading-tight text-slate-100 ring-0 outline-none focus:border-emerald-500 sm:text-xs"
                >
                  <option value="all">Todos</option>
                  <option value="en_servicio">En servicio</option>
                  <option value="detenido">Detenido</option>
                  <option value="sin_senal">Sin señal</option>
                </select>
              </div>
            </div>

            {/* Búsqueda */}
            <div className="mt-3 flex flex-col gap-1">
              <label className="text-[11px] font-medium text-slate-400">
                Buscar unidad
              </label>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Código, placa o conductor"
                className="w-full rounded-md border border-slate-700 bg-slate-900 px-2 py-1.5 text-[16px] leading-tight text-slate-100 ring-0 outline-none placeholder:text-slate-500 focus:border-emerald-500 sm:text-xs"
              />
            </div>
          </div>

          {/* Lista – cards en móvil, tabla en desktop */}
          <div className="flex flex-1 flex-col rounded-2xl border border-slate-800 bg-slate-950/80 p-3 text-xs shadow-sm sm:p-4">
            <div className="mb-2 flex items-center justify-between gap-2">
              <h2 className="text-sm font-semibold text-slate-50">
                Unidades monitoreadas
              </h2>
              <span className="text-[11px] text-slate-400">
                {filteredVehicles.length} unidad(es)
              </span>
            </div>

            {/* Cards móvil */}
            <div className="space-y-2 md:hidden">
              {filteredVehicles.length > 0 ? (
                filteredVehicles.map((v) => (
                  <div
                    key={v.id}
                    className="rounded-xl border border-slate-800 bg-slate-950/80 p-3 text-[11px]"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2">
                        <div className="mt-0.5 rounded-full bg-slate-900 p-1.5">
                          <BusFront className="h-4 w-4 text-emerald-300" />
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-slate-50">
                            {v.code} • {v.plate}
                          </div>
                          <div className="text-[10px] text-slate-400">{v.driverName}</div>
                          <div className="text-[10px] text-slate-500">{v.routeName}</div>
                        </div>
                      </div>
                      {getStatusBadge(v.status)}
                    </div>

                    <div className="mt-2 flex items-center justify-between text-[10px] text-slate-300">
                      <span>Velocidad: {v.speedKmH} km/h</span>
                      <span className="inline-flex items-center gap-1 text-slate-400">
                        <Clock3 className="h-3 w-3" />
                        {v.lastUpdate}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-[11px] text-slate-400">
                  No hay unidades para los filtros seleccionados.
                </p>
              )}
            </div>

            {/* Tabla desktop */}
            <div className="hidden flex-1 overflow-auto md:block">
              {filteredVehicles.length > 0 ? (
                <table className="min-w-full border-separate border-spacing-0 text-[11px]">
                  <thead>
                    <tr className="bg-slate-900/80 text-slate-400">
                      <th className="border-b border-slate-800 px-2 py-1.5 text-left font-medium">
                        Unidad
                      </th>
                      <th className="border-b border-slate-800 px-2 py-1.5 text-left font-medium">
                        Conductor
                      </th>
                      <th className="border-b border-slate-800 px-2 py-1.5 text-left font-medium">
                        Ruta
                      </th>
                      <th className="border-b border-slate-800 px-2 py-1.5 text-left font-medium">
                        Velocidad
                      </th>
                      <th className="border-b border-slate-800 px-2 py-1.5 text-left font-medium">
                        Última actualización
                      </th>
                      <th className="border-b border-slate-800 px-2 py-1.5 text-left font-medium">
                        Estado
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredVehicles.map((v) => (
                      <tr key={v.id} className="hover:bg-slate-900/60">
                        <td className="border-b border-slate-900 px-2 py-1.5 text-slate-100">
                          {v.code} • {v.plate}
                        </td>
                        <td className="border-b border-slate-900 px-2 py-1.5 text-slate-200">
                          {v.driverName}
                        </td>
                        <td className="border-b border-slate-900 px-2 py-1.5 text-slate-200">
                          {v.routeName}
                        </td>
                        <td className="border-b border-slate-900 px-2 py-1.5 text-slate-300">
                          {v.speedKmH} km/h
                        </td>
                        <td className="border-b border-slate-900 px-2 py-1.5 text-slate-300">
                          {v.lastUpdate}
                        </td>
                        <td className="border-b border-slate-900 px-2 py-1.5">
                          {getStatusBadge(v.status)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-[11px] text-slate-400">
                  No hay unidades para los filtros seleccionados.
                </p>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
