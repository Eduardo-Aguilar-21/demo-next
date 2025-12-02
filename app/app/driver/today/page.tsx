// src/app/app/driver/today/page.tsx
"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  BusFront,
  Clock3,
  MapPin,
  Users,
  ArrowRight,
  CalendarDays,
  Play,
} from "lucide-react";

type TodayTripStatus = "SCHEDULED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";

type TodayTrip = {
  id: string;
  startTime: string; // "06:30"
  endTime: string; // "08:00" o "—"
  routeName: string;
  origin: string;
  destination: string;
  passengersTotal: number;
  passengersBoarded: number;
  status: TodayTripStatus;
};

const MOCK_TODAY_TRIPS: TodayTrip[] = [
  {
    id: "1",
    startTime: "06:30",
    endTime: "08:00",
    routeName: "Ruta Sur - Mañana",
    origin: "Villa El Salvador",
    destination: "Oficina San Isidro",
    passengersTotal: 18,
    passengersBoarded: 0,
    status: "SCHEDULED",
  },
  {
    id: "2",
    startTime: "12:30",
    endTime: "13:30",
    routeName: "Ruta Centro - Mediodía",
    origin: "Oficina San Isidro",
    destination: "Lince - Jesús María",
    passengersTotal: 15,
    passengersBoarded: 0,
    status: "SCHEDULED",
  },
  {
    id: "3",
    startTime: "18:00",
    endTime: "19:10",
    routeName: "Ruta Norte - Noche",
    origin: "Oficina San Isidro",
    destination: "Comas",
    passengersTotal: 20,
    passengersBoarded: 0,
    status: "SCHEDULED",
  },
];

function statusLabel(status: TodayTripStatus) {
  switch (status) {
    case "SCHEDULED":
      return "Programado";
    case "IN_PROGRESS":
      return "En curso";
    case "COMPLETED":
      return "Completado";
    case "CANCELLED":
      return "Cancelado";
    default:
      return status;
  }
}

function statusClasses(status: TodayTripStatus) {
  switch (status) {
    case "SCHEDULED":
      return "bg-sky-500/10 text-sky-300 border-sky-500/40";
    case "IN_PROGRESS":
      return "bg-emerald-500/10 text-emerald-300 border-emerald-500/40";
    case "COMPLETED":
      return "bg-slate-500/10 text-slate-300 border-slate-500/40";
    case "CANCELLED":
      return "bg-rose-500/10 text-rose-300 border-rose-500/40";
    default:
      return "";
  }
}

export default function DriverTodayPage() {
  // Para ahora solo tomamos el primer PROGRAMADO como “próximo”.
  const nextTrip = useMemo(
    () => MOCK_TODAY_TRIPS.find((t) => t.status === "SCHEDULED") ?? null,
    []
  );

  const hasTrips = MOCK_TODAY_TRIPS.length > 0;

  return (
    <div className="flex h-full min-h-0 flex-col gap-4 pb-16 md:pb-6">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-lg font-semibold tracking-tight sm:text-xl">Viajes de hoy</h1>
        <p className="max-w-xl text-xs text-slate-400 sm:text-sm">
          Revisa y gestiona los viajes asignados para el día de hoy.
        </p>
      </div>

      {/* Si no hay viajes, mensaje simple */}
      {!hasTrips && (
        <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950/70 p-4 text-sm text-slate-300">
          <p>No tienes viajes asignados para hoy.</p>
        </div>
      )}

      {hasTrips && (
        <>
          {/* Próximo viaje */}
          {nextTrip && (
            <section className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 shadow-sm">
              <div className="mb-2 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <CalendarDays className="h-4 w-4" />
                  <span>Hoy</span>
                </div>
                <span
                  className={cn(
                    "inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium",
                    statusClasses(nextTrip.status)
                  )}
                >
                  {statusLabel(nextTrip.status)}
                </span>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-1 rounded-full bg-emerald-500/10 p-2">
                  <BusFront className="h-5 w-5 text-emerald-400" />
                </div>

                <div className="flex-1 space-y-2">
                  <div>
                    <h2 className="text-sm font-semibold text-slate-50 sm:text-base">
                      Próximo viaje: {nextTrip.routeName}
                    </h2>
                    <p className="mt-0.5 text-xs text-slate-400">
                      {nextTrip.origin} → {nextTrip.destination}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300">
                    <div className="flex items-center gap-1.5">
                      <Clock3 className="h-4 w-4 text-slate-500" />
                      <span>
                        {nextTrip.startTime} - {nextTrip.endTime}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users className="h-4 w-4 text-slate-500" />
                      <span>
                        {nextTrip.passengersBoarded}/{nextTrip.passengersTotal} pasajeros
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-1 text-xs">
                    <Link
                      href={`/app/driver/trips/${nextTrip.id}`}
                      className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500 px-3 py-1 text-xs font-medium text-emerald-950 hover:bg-emerald-400"
                    >
                      <Play className="h-3.5 w-3.5" />
                      <span>Ir al viaje</span>
                    </Link>
                    <Link
                      href={`/app/driver/trips/${nextTrip.id}`}
                      className="inline-flex items-center gap-1.5 rounded-full border border-slate-700 px-3 py-1 text-xs font-medium text-slate-200 hover:border-slate-500"
                    >
                      <Users className="h-3.5 w-3.5" />
                      <span>Ver pasajeros</span>
                    </Link>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Contenedor principal: lista de todos los viajes de hoy */}
          <section className="grid gap-4 md:grid-cols-2">
            {/* Lista (cards) – se ve bien en ambos, pero en desktop queda tipo dos columnas */}
            <div className="col-span-1 flex flex-col gap-3">
              {MOCK_TODAY_TRIPS.map((trip) => (
                <article
                  key={trip.id}
                  className="rounded-2xl border border-slate-800 bg-slate-950/70 p-3 shadow-sm"
                >
                  <div className="mb-1 flex items-center justify-between gap-2">
                    <h2 className="text-sm font-semibold text-slate-50">
                      {trip.routeName}
                    </h2>
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium",
                        statusClasses(trip.status)
                      )}
                    >
                      {statusLabel(trip.status)}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400">
                    {trip.origin} → {trip.destination}
                  </p>

                  <div className="mt-2 space-y-1.5 text-xs text-slate-300">
                    <div className="flex items-center gap-2">
                      <Clock3 className="h-4 w-4 text-slate-500" />
                      <span>
                        {trip.startTime} - {trip.endTime}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-slate-500" />
                      <span>
                        {trip.passengersBoarded}/{trip.passengersTotal} pasajeros
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between gap-2 text-xs">
                    <Link
                      href={`/app/driver/trips/${trip.id}`}
                      className="inline-flex items-center gap-1.5 rounded-full border border-slate-700 px-3 py-1 font-medium text-slate-200 hover:border-slate-500"
                    >
                      <ArrowRight className="h-3.5 w-3.5" />
                      <span>Ver detalle</span>
                    </Link>
                    <span className="text-[11px] text-slate-500">ID: {trip.id}</span>
                  </div>
                </article>
              ))}
            </div>

            {/* Columna derecha reservada para el futuro (mapa, timeline, etc.) */}
            <div className="hidden flex-col gap-3 md:flex">
              <div className="flex-1 rounded-2xl border border-dashed border-slate-800 bg-slate-950/40 p-4 text-xs text-slate-500">
                <p className="mb-1 font-medium text-slate-300">
                  Próximamente: mapa y ruta
                </p>
                <p>
                  Aquí puedes mostrar el mapa con la ruta del próximo viaje, posición del
                  bus en tiempo real, o un timeline de paraderos.
                </p>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
