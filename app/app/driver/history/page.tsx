// src/app/app/driver/history/page.tsx
"use client";

import React from "react";
import { Clock3, Users, MapPin, CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils";

type TripStatus = "COMPLETED" | "CANCELLED" | "PARTIAL";

type DriverTripHistory = {
  id: string;
  date: string; // "2025-12-01"
  startTime: string; // "06:30"
  endTime: string; // "08:10"
  routeName: string;
  origin: string;
  destination: string;
  passengersTotal: number;
  passengersBoarded: number;
  status: TripStatus;
};

const MOCK_HISTORY: DriverTripHistory[] = [
  {
    id: "1",
    date: "2025-12-01",
    startTime: "06:30",
    endTime: "08:10",
    routeName: "Ruta Sur - Mañana",
    origin: "Villa El Salvador",
    destination: "Oficina San Isidro",
    passengersTotal: 18,
    passengersBoarded: 17,
    status: "PARTIAL",
  },
  {
    id: "2",
    date: "2025-11-30",
    startTime: "18:00",
    endTime: "19:20",
    routeName: "Ruta Centro - Noche",
    origin: "Oficina San Isidro",
    destination: "SJL",
    passengersTotal: 20,
    passengersBoarded: 20,
    status: "COMPLETED",
  },
  {
    id: "3",
    date: "2025-11-29",
    startTime: "06:30",
    endTime: "—",
    routeName: "Ruta Norte - Mañana",
    origin: "Comas",
    destination: "Oficina Miraflores",
    passengersTotal: 15,
    passengersBoarded: 0,
    status: "CANCELLED",
  },
];

function formatStatus(status: TripStatus) {
  switch (status) {
    case "COMPLETED":
      return "Completado";
    case "CANCELLED":
      return "Cancelado";
    case "PARTIAL":
      return "Incompleto";
    default:
      return status;
  }
}

function statusClasses(status: TripStatus) {
  switch (status) {
    case "COMPLETED":
      return "bg-emerald-500/10 text-emerald-300 border-emerald-500/40";
    case "CANCELLED":
      return "bg-rose-500/10 text-rose-300 border-rose-500/40";
    case "PARTIAL":
      return "bg-amber-500/10 text-amber-300 border-amber-500/40";
    default:
      return "";
  }
}

export default function DriverHistoryPage() {
  return (
    <div className="flex h-full min-h-0 flex-col gap-4 pb-16 md:pb-6">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-lg font-semibold tracking-tight sm:text-xl">
          Historial de viajes
        </h1>
        <p className="max-w-xl text-xs text-slate-400 sm:text-sm">
          Revisa tus viajes anteriores, cuántos pasajeros subieron y el estado final de
          cada ruta.
        </p>
      </div>

      {/* Filtros simples (placeholder) */}
      <div className="flex flex-wrap gap-2 text-xs sm:text-sm">
        <button className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-slate-100">
          Últimos 7 días
        </button>
        <button className="rounded-full border border-slate-800 bg-slate-950 px-3 py-1 text-slate-400 hover:border-slate-700 hover:text-slate-100">
          Último mes
        </button>
        <button className="rounded-full border border-slate-800 bg-slate-950 px-3 py-1 text-slate-400 hover:border-slate-700 hover:text-slate-100">
          Todos
        </button>
      </div>

      {/* Desktop: tabla */}
      <div className="hidden flex-1 flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/60 shadow-sm md:flex">
        <div className="border-b border-slate-800 px-4 py-3 text-xs font-medium tracking-wide text-slate-500 uppercase">
          Resumen
        </div>
        <div className="flex-1 overflow-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-950/80 text-xs tracking-wide text-slate-500 uppercase">
              <tr>
                <th className="px-4 py-3 text-left">Fecha</th>
                <th className="px-4 py-3 text-left">Ruta</th>
                <th className="px-4 py-3 text-left">Horario</th>
                <th className="px-4 py-3 text-left">Origen / Destino</th>
                <th className="px-4 py-3 text-left">Pasajeros</th>
                <th className="px-4 py-3 text-left">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {MOCK_HISTORY.map((trip) => (
                <tr key={trip.id} className="hover:bg-slate-900/60">
                  <td className="px-4 py-3 align-top text-slate-200">
                    <div className="flex items-center gap-2">
                      <CalendarDays className="h-4 w-4 text-slate-500" />
                      <span>{trip.date}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 align-top text-slate-100">{trip.routeName}</td>
                  <td className="px-4 py-3 align-top text-slate-200">
                    <div className="flex items-center gap-2">
                      <Clock3 className="h-4 w-4 text-slate-500" />
                      <span>
                        {trip.startTime} - {trip.endTime}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 align-top text-slate-300">
                    <div className="flex flex-col gap-0.5 text-xs">
                      <span className="flex items-center gap-1.5">
                        <MapPin className="h-3 w-3 text-slate-500" />
                        <span className="truncate">{trip.origin}</span>
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MapPin className="h-3 w-3 text-emerald-500" />
                        <span className="truncate">{trip.destination}</span>
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 align-top text-slate-200">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-slate-500" />
                      <span>
                        {trip.passengersBoarded}/{trip.passengersTotal}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 align-top">
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
                        statusClasses(trip.status)
                      )}
                    >
                      {formatStatus(trip.status)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile: tarjetas */}
      <div className="flex flex-1 flex-col gap-3 md:hidden">
        {MOCK_HISTORY.map((trip) => (
          <article
            key={trip.id}
            className="rounded-2xl border border-slate-800 bg-slate-950/80 p-3 shadow-sm"
          >
            <div className="mb-2 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <CalendarDays className="h-4 w-4" />
                <span>{trip.date}</span>
              </div>
              <span
                className={cn(
                  "inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium",
                  statusClasses(trip.status)
                )}
              >
                {formatStatus(trip.status)}
              </span>
            </div>

            <h2 className="text-sm font-semibold text-slate-50">{trip.routeName}</h2>

            <div className="mt-2 space-y-1.5 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <Clock3 className="h-4 w-4 text-slate-500" />
                <span>
                  {trip.startTime} - {trip.endTime}
                </span>
              </div>

              <div className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 text-slate-500" />
                <div className="flex flex-col gap-0.5">
                  <span className="text-[11px] tracking-wide text-slate-500 uppercase">
                    Origen
                  </span>
                  <span className="text-xs text-slate-200">{trip.origin}</span>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 text-emerald-500" />
                <div className="flex flex-col gap-0.5">
                  <span className="text-[11px] tracking-wide text-slate-500 uppercase">
                    Destino
                  </span>
                  <span className="text-xs text-slate-200">{trip.destination}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1 text-xs">
                <Users className="h-4 w-4 text-slate-500" />
                <span className="text-slate-200">
                  {trip.passengersBoarded}/{trip.passengersTotal} pasajeros
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
