// src/app/app/driver/page.tsx
"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { BusFront, MapPin, Clock3, Users, Navigation, Radar } from "lucide-react";

type PickupRequest = {
  id: string;
  employeeName: string;
  companyName: string;
  pickupLocation: string;
  dropLocation: string;
  distanceKm: number;
  etaMinutes: number;
  passengers: number;
};

const MOCK_REQUESTS: PickupRequest[] = [
  {
    id: "req-1",
    employeeName: "Carlos Mendoza",
    companyName: "TechCorp Lima",
    pickupLocation: "Av. Javier Prado Este 1200",
    dropLocation: "Oficina San Isidro",
    distanceKm: 1.2,
    etaMinutes: 4,
    passengers: 1,
  },
  {
    id: "req-2",
    employeeName: "Ana López",
    companyName: "Finanzas Perú",
    pickupLocation: "Calle Los Laureles 345",
    dropLocation: "Oficina San Isidro",
    distanceKm: 2.8,
    etaMinutes: 8,
    passengers: 2,
  },
  {
    id: "req-3",
    employeeName: "Grupo Zona Norte",
    companyName: "Logística Andina",
    pickupLocation: "Paradero Tomás Marsano",
    dropLocation: "Planta Villa El Salvador",
    distanceKm: 4.3,
    etaMinutes: 12,
    passengers: 4,
  },
];

export default function DriverDashboardPage() {
  const hasRequests = MOCK_REQUESTS.length > 0;

  return (
    <div className="flex h-full min-h-0 flex-col gap-4 pb-16 md:pb-6">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-lg font-semibold tracking-tight sm:text-xl">Dashboard</h1>
        <p className="max-w-xl text-xs text-slate-400 sm:text-sm">
          Mapa en tiempo real y solicitudes de recogida cercanas para tus empleados.
        </p>
      </div>

      {/* Layout principal: mapa + peticiones */}
      <div className="grid flex-1 grid-rows-2 gap-4 md:grid-cols-2 md:grid-rows-1">
        {/* Mapa (placeholder por ahora) */}
        <section className="row-span-1 rounded-2xl border border-slate-800 bg-slate-950/80 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-800 px-4 py-2.5 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <Radar className="h-4 w-4 text-emerald-400" />
              <span>Mapa de operación</span>
            </div>
            <div className="flex items-center gap-2 text-[11px]">
              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2 py-0.5 text-emerald-300">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                En línea
              </span>
            </div>
          </div>

          <div className="relative flex h-full min-h-[260px] flex-col overflow-hidden">
            {/* Fondo tipo “mapa” placeholder */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_#0f172a,_#020617)]">
              <div className="absolute inset-0 [background-image:radial-gradient(circle,#ffffff_1px,transparent_0)] [background-size:24px_24px] opacity-10" />
            </div>

            {/* Contenido overlay */}
            <div className="relative z-10 flex flex-1 flex-col justify-between p-4">
              {/* Info principal */}
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 rounded-full bg-slate-900/80 px-3 py-1 text-xs text-slate-200">
                  <BusFront className="h-4 w-4 text-emerald-400" />
                  <span>Unidad asignada: BZ-452</span>
                </div>

                <div className="max-w-xs rounded-2xl bg-slate-950/80 p-3 text-xs text-slate-200">
                  <p className="font-semibold text-slate-50">Próxima zona de recogida</p>
                  <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-400">
                    <MapPin className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Radio de 3 km alrededor de tu ubicación actual</span>
                  </div>
                </div>
              </div>

              {/* Controles rápidos */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap gap-2 text-[11px] text-slate-300">
                  <button className="inline-flex items-center gap-1 rounded-full bg-slate-900/80 px-3 py-1 hover:bg-slate-800">
                    <Navigation className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Recentrar en mi posición</span>
                  </button>
                  <button className="inline-flex items-center gap-1 rounded-full border border-slate-700 bg-slate-950/80 px-3 py-1 hover:border-slate-500">
                    <MapPin className="h-3.5 w-3.5 text-slate-400" />
                    <span>Ver paraderos de hoy</span>
                  </button>
                </div>

                <div className="rounded-xl bg-slate-900/80 px-3 py-1.5 text-[11px] text-slate-300">
                  <span className="font-medium text-slate-100">
                    3 solicitudes activas
                  </span>
                  <span className="mx-1 text-slate-600">•</span>
                  <span>Rango: 5 km</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Peticiones cercanas */}
        <section className="row-span-1 flex flex-col rounded-2xl border border-slate-800 bg-slate-950/80 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-800 px-4 py-2.5 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-emerald-400" />
              <span>Peticiones de recogida cercanas</span>
            </div>
            <button className="rounded-full border border-slate-700 bg-slate-950 px-2.5 py-1 text-[11px] hover:border-slate-500">
              Actualizar
            </button>
          </div>

          <div className="flex-1 overflow-auto p-3">
            {!hasRequests && (
              <p className="mt-2 text-xs text-slate-400">
                No hay solicitudes de recogida cerca de ti en este momento.
              </p>
            )}

            {hasRequests && (
              <div className="flex flex-col gap-3">
                {MOCK_REQUESTS.map((req) => (
                  <article
                    key={req.id}
                    className="rounded-2xl border border-slate-800 bg-slate-950/90 p-3 text-xs text-slate-200"
                  >
                    <div className="mb-1 flex items-center justify-between gap-2">
                      <div className="flex flex-col">
                        <span className="text-[11px] tracking-wide text-slate-500 uppercase">
                          {req.companyName}
                        </span>
                        <span className="text-sm font-semibold text-slate-50">
                          {req.employeeName}
                        </span>
                      </div>
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] text-emerald-300">
                        <Clock3 className="h-3.5 w-3.5" />
                        <span>{req.etaMinutes} min</span>
                      </span>
                    </div>

                    <div className="mt-2 space-y-1.5 text-[11px] text-slate-300">
                      <div className="flex items-start gap-2">
                        <MapPin className="mt-0.5 h-3.5 w-3.5 text-slate-500" />
                        <div>
                          <span className="text-[10px] tracking-wide text-slate-500 uppercase">
                            Punto de recojo
                          </span>
                          <p className="text-xs text-slate-200">{req.pickupLocation}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <MapPin className="mt-0.5 h-3.5 w-3.5 text-emerald-400" />
                        <div>
                          <span className="text-[10px] tracking-wide text-slate-500 uppercase">
                            Destino
                          </span>
                          <p className="text-xs text-slate-200">{req.dropLocation}</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-2 flex items-center justify-between gap-2 text-[11px] text-slate-300">
                      <div className="flex items-center gap-2">
                        <div className="inline-flex items-center gap-1 rounded-full bg-slate-900 px-2 py-0.5">
                          <Navigation className="h-3.5 w-3.5 text-slate-400" />
                          <span>{req.distanceKm.toFixed(1)} km</span>
                        </div>
                        <div className="inline-flex items-center gap-1 rounded-full bg-slate-900 px-2 py-0.5">
                          <Users className="h-3.5 w-3.5 text-slate-400" />
                          <span>{req.passengers} pasajero(s)</span>
                        </div>
                      </div>

                      <button className="inline-flex items-center gap-1 rounded-full bg-emerald-500 px-3 py-1 text-[11px] font-semibold text-emerald-950 hover:bg-emerald-400">
                        <BusFront className="h-3.5 w-3.5" />
                        <span>Aceptar</span>
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
