"use client";

import React, { useState } from "react";
import RoutesMap, { RoutePoint } from "@/components/RoutesMap";

type RoutePointType = "pickup" | "dropoff" | "other";

type RoutePointExtended = RoutePoint & {
  name: string;
  type: RoutePointType;
};

type Route = {
  id: number;
  name: string;
  description?: string;
  points: RoutePointExtended[];
};

const AdminRoutesPage: React.FC = () => {
  const [routes, setRoutes] = useState<Route[]>([
    {
      id: 1,
      name: "Ruta Planta Sur - Turno Mañana",
      description: "Recojo de alumnos turno mañana",
      points: [],
    },
  ]);

  const [selectedRouteId, setSelectedRouteId] = useState<number>(1);

  // Punto “pendiente” después de hacer click en el mapa
  const [pendingPoint, setPendingPoint] = useState<RoutePointExtended | null>(null);

  const selectedRoute = routes.find((r) => r.id === selectedRouteId) ?? routes[0];

  // CLICK en mapa: crear pendingPoint + intentar sugerir nombre por calle
  const handleMapClick = async ({ lon, lat }: { lon: number; lat: number }) => {
    if (!selectedRoute) return;

    const id = Date.now();

    // 1) Crear punto base (se ve al toque en el mapa)
    setPendingPoint({
      id,
      name: "",
      type: "pickup",
      lat,
      lng: lon,
    });

    // 2) Intentar reverse geocoding (Nominatim / OSM)
    try {
      const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`;

      const res = await fetch(url, {
        headers: {
          "Accept-Language": "es",
        },
      });

      if (!res.ok) return;

      const data = await res.json();

      const address = data.address ?? {};
      const suggested =
        data.display_name ||
        [
          address.road,
          address.house_number,
          address.neighbourhood || address.suburb,
          address.city || address.town || address.village,
        ]
          .filter(Boolean)
          .join(", ");

      if (!suggested) return;

      // 3) Actualizar solo si el pendingPoint sigue siendo este mismo id
      setPendingPoint((prev) =>
        prev && prev.id === id ? { ...prev, name: suggested } : prev
      );
    } catch (err) {
      console.error("Error reverse geocoding:", err);
    }
  };

  const handleChangePendingPoint = (
    field: keyof Omit<RoutePointExtended, "id" | "lat" | "lng">,
    value: string
  ) => {
    if (!pendingPoint) return;
    setPendingPoint({
      ...pendingPoint,
      [field]: value,
    });
  };

  const handleAddPointToRoute = () => {
    if (!pendingPoint || !selectedRoute) return;

    setRoutes((prev) =>
      prev.map((r) =>
        r.id === selectedRoute.id ? { ...r, points: [...r.points, pendingPoint] } : r
      )
    );

    setPendingPoint(null);
  };

  const handleCancelPendingPoint = () => {
    setPendingPoint(null);
  };

  const handleChangeRoute = (value: string) => {
    setSelectedRouteId(Number(value));
    setPendingPoint(null);
  };

  // Puntos que se dibujan en el mapa: los guardados + el pendiente
  const pointsForMap: RoutePoint[] = [
    ...(selectedRoute?.points ?? []),
    ...(pendingPoint ? [pendingPoint] : []),
  ];

  return (
    <div className="flex h-full min-h-0 flex-col gap-4 pb-16 md:pb-6">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-lg font-semibold tracking-tight sm:text-xl">
          Rutas y puntos (Módulo Administrativo)
        </h1>
        <p className="max-w-xl text-xs text-slate-400 sm:text-sm">
          Haz clic en el mapa para proponer un nuevo punto de recojo / bajada y así armar
          la ruta.
        </p>
      </div>

      <div className="grid flex-1 gap-4 md:grid-cols-[2fr,1fr]">
        {/* Columna izquierda: mapa + panel de punto pendiente */}
        <section className="flex flex-col gap-3">
          <div className="min-h-[260px] flex-1 overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/80">
            <RoutesMap points={pointsForMap} onMapClick={handleMapClick} />
          </div>

          {/* Panel para confirmar punto nuevo */}
          {pendingPoint && (
            <div className="rounded-2xl border border-slate-800 bg-slate-950/90 p-4 text-xs shadow-sm">
              <div className="mb-3 text-sm font-semibold text-slate-50">
                Nuevo punto en el mapa
              </div>

              <div className="mb-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-medium text-slate-400">
                    Latitud
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={pendingPoint.lat.toFixed(6)}
                    className="w-full rounded-md border border-slate-700 bg-slate-900 px-2 py-1.5 text-xs text-slate-100 ring-0 outline-none focus:border-emerald-500"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-medium text-slate-400">
                    Longitud
                  </label>
                  <input
                    type="text"
                    readOnly
                    value={pendingPoint.lng.toFixed(6)}
                    className="w-full rounded-md border border-slate-700 bg-slate-900 px-2 py-1.5 text-xs text-slate-100 ring-0 outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="mb-3 grid grid-cols-1 gap-3 sm:grid-cols-[2fr,1fr]">
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-medium text-slate-400">
                    Nombre del punto
                  </label>
                  <input
                    type="text"
                    value={pendingPoint.name}
                    onChange={(e) => handleChangePendingPoint("name", e.target.value)}
                    placeholder="Ej: Casa Juan Pérez"
                    className="w-full rounded-md border border-slate-700 bg-slate-900 px-2 py-1.5 text-xs text-slate-100 ring-0 outline-none placeholder:text-slate-500 focus:border-emerald-500"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-medium text-slate-400">Tipo</label>
                  <select
                    value={pendingPoint.type}
                    onChange={(e) =>
                      handleChangePendingPoint("type", e.target.value as RoutePointType)
                    }
                    className="w-full rounded-md border border-slate-700 bg-slate-900 px-2 py-1.5 text-xs text-slate-100 ring-0 outline-none focus:border-emerald-500"
                  >
                    <option value="pickup">Recojo</option>
                    <option value="dropoff">Bajada</option>
                    <option value="other">Otro</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 text-xs">
                <button
                  type="button"
                  onClick={handleCancelPendingPoint}
                  className="rounded-md border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-slate-200 hover:border-slate-500"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleAddPointToRoute}
                  className="rounded-md bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-emerald-950 hover:bg-emerald-400"
                >
                  Agregar a la ruta
                </button>
              </div>
            </div>
          )}
        </section>

        {/* Columna derecha: rutas y lista de puntos */}
        <section className="flex min-w-[260px] flex-col gap-3">
          {/* Selector de ruta */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 text-xs shadow-sm">
            <div className="mb-2 text-sm font-semibold text-slate-50">
              Ruta seleccionada
            </div>
            <select
              value={selectedRouteId}
              onChange={(e) => handleChangeRoute(e.target.value)}
              className="w-full rounded-md border border-slate-700 bg-slate-900 px-2 py-1.5 text-xs text-slate-100 ring-0 outline-none focus:border-emerald-500"
            >
              {routes.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
            {selectedRoute?.description && (
              <p className="mt-2 text-[11px] text-slate-400">
                {selectedRoute.description}
              </p>
            )}
          </div>

          {/* Lista de puntos de la ruta */}
          <div className="flex flex-1 flex-col rounded-2xl border border-slate-800 bg-slate-950/80 p-4 text-xs shadow-sm">
            <div className="mb-2 text-sm font-semibold text-slate-50">
              Puntos de la ruta
            </div>

            <div className="flex-1 overflow-auto">
              {selectedRoute && selectedRoute.points.length > 0 ? (
                <table className="min-w-full border-separate border-spacing-0 text-[11px]">
                  <thead>
                    <tr className="bg-slate-900/80 text-slate-400">
                      <th className="border-b border-slate-800 px-2 py-1.5 text-left font-medium">
                        Nombre
                      </th>
                      <th className="border-b border-slate-800 px-2 py-1.5 text-left font-medium">
                        Tipo
                      </th>
                      <th className="border-b border-slate-800 px-2 py-1.5 text-left font-medium">
                        Lat
                      </th>
                      <th className="border-b border-slate-800 px-2 py-1.5 text-left font-medium">
                        Lng
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedRoute.points.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-900/60">
                        <td className="border-b border-slate-900 px-2 py-1.5 text-slate-100">
                          {p.name || "(sin nombre)"}
                        </td>
                        <td className="border-b border-slate-900 px-2 py-1.5 text-slate-200 capitalize">
                          {p.type}
                        </td>
                        <td className="border-b border-slate-900 px-2 py-1.5 font-mono text-slate-300">
                          {p.lat.toFixed(5)}
                        </td>
                        <td className="border-b border-slate-900 px-2 py-1.5 font-mono text-slate-300">
                          {p.lng.toFixed(5)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-[11px] text-slate-400">
                  Aún no hay puntos registrados para esta ruta. Haz clic en el mapa para
                  agregar uno.
                </p>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminRoutesPage;
