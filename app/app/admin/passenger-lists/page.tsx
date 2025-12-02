"use client";

import React, { useRef, useState } from "react";

type PassengerStatus = "programado" | "baja" | "nuevo";

type PassengerRow = {
  id: number;
  fullName: string;
  document: string;
  routeName: string;
  stopName: string;
  pickupTime: string;
  status: PassengerStatus;
};

const MOCK_ROUTES = [
  { id: 1, name: "Ruta Planta Sur - Turno Mañana" },
  { id: 2, name: "Ruta Planta Norte - Turno Noche" },
];

const MOCK_PASSENGERS: PassengerRow[] = [
  {
    id: 1,
    fullName: "María López",
    document: "DNI 12345678",
    routeName: "Ruta Planta Sur - Turno Mañana",
    stopName: "Av. Los Olivos 123",
    pickupTime: "06:45",
    status: "programado",
  },
  {
    id: 2,
    fullName: "Juan Pérez",
    document: "DNI 87654321",
    routeName: "Ruta Planta Sur - Turno Mañana",
    stopName: "Jr. Las Flores 456",
    pickupTime: "06:50",
    status: "nuevo",
  },
  {
    id: 3,
    fullName: "Ana Torres",
    document: "DNI 44556677",
    routeName: "Ruta Planta Norte - Turno Noche",
    stopName: "Av. Central 890",
    pickupTime: "21:10",
    status: "baja",
  },
];

export default function AdminPassengerListsPage() {
  const [selectedRouteId, setSelectedRouteId] = useState<number | "all">("all");
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const d = new Date();
    return d.toISOString().slice(0, 10);
  });
  const [search, setSearch] = useState("");
  const [rows] = useState<PassengerRow[]>(MOCK_PASSENGERS);

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const filteredRows = rows.filter((row) => {
    const matchRoute =
      selectedRouteId === "all" ||
      row.routeName === MOCK_ROUTES.find((r) => r.id === selectedRouteId)?.name;
    const matchSearch =
      !search ||
      row.fullName.toLowerCase().includes(search.toLowerCase()) ||
      row.document.toLowerCase().includes(search.toLowerCase());
    return matchRoute && matchSearch;
  });

  // Abrir modal de carga
  const handleClickUpload = () => {
    setShowUploadModal(true);
  };

  // Manejo centralizado del archivo elegido
  const handleFileSelected = (file: File) => {
    console.log("Excel seleccionado:", file.name);
    // Aquí luego mandarás el Excel al backend
    setShowUploadModal(false);
    setDragActive(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    handleFileSelected(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    handleFileSelected(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const getStatusBadge = (status: PassengerStatus) => {
    switch (status) {
      case "programado":
        return (
          <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-300">
            Programado
          </span>
        );
      case "baja":
        return (
          <span className="inline-flex items-center rounded-full bg-red-500/10 px-2 py-0.5 text-[10px] font-medium text-red-300">
            Baja
          </span>
        );
      case "nuevo":
        return (
          <span className="inline-flex items-center rounded-full bg-sky-500/10 px-2 py-0.5 text-[10px] font-medium text-sky-300">
            Nuevo
          </span>
        );
    }
  };

  return (
    <>
      {/* ⬇︎ pb-20 para respetar el bottom-nav en móvil */}
      <div className="flex h-full min-h-0 flex-col gap-4 pb-20 md:pb-6">
        {/* Header */}
        <div className="space-y-1">
          <h1 className="text-lg font-semibold tracking-tight sm:text-xl">
            Listas de pasajeros
          </h1>
          <p className="max-w-xl text-xs text-slate-400 sm:text-sm">
            Gestiona las listas diarias de pasajeros por ruta. Puedes importar un archivo
            Excel enviado por el cliente o registrar ajustes manuales.
          </p>
        </div>

        {/* Filtros y acciones */}
        <section className="flex flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-950/80 p-3 text-xs shadow-sm sm:p-4">
          <div className="grid gap-3 md:grid-cols-[1.4fr,1fr,1fr]">
            {/* Ruta */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-medium text-slate-400">Ruta</label>
              <select
                value={selectedRouteId}
                onChange={(e) =>
                  setSelectedRouteId(
                    e.target.value === "all" ? "all" : Number(e.target.value)
                  )
                }
                className="w-full rounded-md border border-slate-700 bg-slate-900 px-2 py-1.5 text-[16px] leading-tight text-slate-100 ring-0 outline-none placeholder:text-slate-500 focus:border-emerald-500 sm:text-xs"
              >
                <option value="all">Todas las rutas</option>
                {MOCK_ROUTES.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Fecha */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-medium text-slate-400">
                Fecha de servicio
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full rounded-md border border-slate-700 bg-slate-900 px-2 py-1.5 text-[16px] leading-tight text-slate-100 ring-0 outline-none focus:border-emerald-500 sm:text-xs"
              />
            </div>

            {/* Búsqueda */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-medium text-slate-400">
                Buscar pasajero
              </label>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Nombre o documento"
                className="w-full rounded-md border border-slate-700 bg-slate-900 px-2 py-1.5 text-[16px] leading-tight text-slate-100 ring-0 outline-none placeholder:text-slate-500 focus:border-emerald-500 sm:text-xs"
              />
            </div>
          </div>

          {/* Acciones: subir Excel, descargar plantilla, agregar manual */}
          <div className="mt-1 flex flex-col gap-2 sm:mt-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-2 text-[11px]">
              <button
                type="button"
                onClick={handleClickUpload}
                className="rounded-md bg-emerald-500 px-3 py-1.5 text-[13px] font-semibold text-emerald-950 hover:bg-emerald-400 sm:text-[11px]"
              >
                Cargar lista desde Excel
              </button>
              <button
                type="button"
                className="rounded-md border border-slate-700 bg-slate-900 px-3 py-1.5 text-[13px] text-slate-200 hover:border-slate-500 sm:text-[11px]"
              >
                Descargar plantilla Excel
              </button>
              <button
                type="button"
                className="rounded-md border border-slate-700 bg-slate-900 px-3 py-1.5 text-[13px] text-slate-200 hover:border-slate-500 sm:text-[11px]"
              >
                Agregar pasajero manualmente
              </button>
            </div>

            <p className="text-[11px] text-slate-500">
              Formato sugerido: columnas para nombre, documento, ruta, punto de recojo y
              hora.
            </p>
          </div>
        </section>

        {/* Lista de pasajeros */}
        <section className="flex flex-1 flex-col rounded-2xl border border-slate-800 bg-slate-950/80 p-3 text-xs shadow-sm sm:p-4">
          <div className="mb-2 flex items-center justify-between gap-2">
            <h2 className="text-sm font-semibold text-slate-50">Pasajeros programados</h2>
            <span className="text-[11px] text-slate-400">
              {filteredRows.length} pasajero(s) para {selectedDate}
            </span>
          </div>

          {/* ✅ Vista cards en móvil, sin tabla, sin scroll lateral */}
          <div className="space-y-2 md:hidden">
            {filteredRows.length > 0 ? (
              filteredRows.map((row) => (
                <div
                  key={row.id}
                  className="rounded-xl border border-slate-800 bg-slate-950/80 p-3 text-[11px]"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="text-xs font-semibold text-slate-50">
                        {row.fullName}
                      </div>
                      <div className="text-[10px] text-slate-400">{row.document}</div>
                      <div className="mt-1 text-[10px] text-slate-500">
                        {row.routeName}
                      </div>
                      <div className="text-[10px] text-slate-400">{row.stopName}</div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      {getStatusBadge(row.status)}
                      <span className="font-mono text-[10px] text-slate-300">
                        {row.pickupTime}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-[11px] text-slate-400">
                No hay pasajeros para los filtros seleccionados. Carga una lista desde
                Excel o registra pasajeros manualmente.
              </p>
            )}
          </div>

          {/* ✅ Tabla solo en desktop, con overflow controlado */}
          <div className="hidden flex-1 md:block">
            {filteredRows.length > 0 ? (
              <div className="h-full w-full overflow-auto">
                <table className="min-w-full border-separate border-spacing-0 text-[11px]">
                  <thead>
                    <tr className="bg-slate-900/80 text-slate-400">
                      <th className="border-b border-slate-800 px-2 py-1.5 text-left font-medium">
                        Pasajero
                      </th>
                      <th className="border-b border-slate-800 px-2 py-1.5 text-left font-medium">
                        Documento
                      </th>
                      <th className="border-b border-slate-800 px-2 py-1.5 text-left font-medium">
                        Ruta
                      </th>
                      <th className="border-b border-slate-800 px-2 py-1.5 text-left font-medium">
                        Punto de recojo
                      </th>
                      <th className="border-b border-slate-800 px-2 py-1.5 text-left font-medium">
                        Hora
                      </th>
                      <th className="border-b border-slate-800 px-2 py-1.5 text-left font-medium">
                        Estado
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRows.map((row) => (
                      <tr key={row.id} className="hover:bg-slate-900/60">
                        <td className="border-b border-slate-900 px-2 py-1.5 text-slate-100">
                          {row.fullName}
                        </td>
                        <td className="border-b border-slate-900 px-2 py-1.5 text-slate-300">
                          {row.document}
                        </td>
                        <td className="border-b border-slate-900 px-2 py-1.5 text-slate-200">
                          {row.routeName}
                        </td>
                        <td className="border-b border-slate-900 px-2 py-1.5 text-slate-200">
                          {row.stopName}
                        </td>
                        <td className="border-b border-slate-900 px-2 py-1.5 font-mono text-slate-300">
                          {row.pickupTime}
                        </td>
                        <td className="border-b border-slate-900 px-2 py-1.5">
                          {getStatusBadge(row.status)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-[11px] text-slate-400">
                No hay pasajeros para los filtros seleccionados. Carga una lista desde
                Excel o registra pasajeros manualmente.
              </p>
            )}
          </div>
        </section>
      </div>

      {/* MODAL de carga Excel */}
      {showUploadModal && (
        <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/60 px-2 sm:items-center sm:px-4">
          <div className="w-full max-w-md rounded-t-2xl border border-slate-800 bg-slate-950 p-3 text-xs shadow-xl sm:max-w-lg sm:rounded-2xl sm:p-5">
            <div className="mb-2 flex items-start justify-between gap-2 sm:mb-3">
              <div>
                <h2 className="text-sm font-semibold text-slate-50">
                  Cargar lista desde Excel
                </h2>
                <p className="mt-1 text-[11px] text-slate-400">
                  El archivo debe contener una fila por pasajero y las siguientes
                  columnas:
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowUploadModal(false)}
                className="rounded-md px-2 py-1 text-[11px] text-slate-400 hover:bg-slate-900"
              >
                Cerrar
              </button>
            </div>

            <div className="mb-2 rounded-xl border border-slate-800 bg-slate-950/80 p-2.5 sm:mb-3 sm:p-3">
              <ul className="list-disc space-y-1 pl-4 text-[11px] text-slate-300">
                <li>
                  <span className="font-semibold">fecha_servicio</span> (YYYY-MM-DD)
                </li>
                <li>
                  <span className="font-semibold">ruta_codigo</span> y{" "}
                  <span className="font-semibold">ruta_nombre</span>
                </li>
                <li>
                  <span className="font-semibold">documento</span> (DNI, CE, etc.)
                </li>
                <li>
                  <span className="font-semibold">pasajero_nombre</span>
                </li>
                <li>
                  <span className="font-semibold">punto_recojo</span>
                </li>
                <li>
                  <span className="font-semibold">hora_recojo</span> (HH:mm)
                </li>
                <li>
                  <span className="font-semibold">estado</span> (PROGRAMADO, BAJA, NUEVO)
                </li>
              </ul>
            </div>

            {/* Dropzone */}
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-3 py-5 text-center text-[11px] transition sm:px-4 sm:py-6 ${
                dragActive
                  ? "border-emerald-400 bg-emerald-500/5 text-emerald-200"
                  : "border-slate-700 bg-slate-950/80 text-slate-300 hover:border-slate-500"
              }`}
              onClick={() => fileInputRef.current?.click()}
            >
              <p className="mb-1 font-medium">Arrastra y suelta el archivo aquí</p>
              <p className="text-[10px] text-slate-400">
                o haz clic para buscar en tu computadora (.xlsx, .xls)
              </p>
            </div>

            {/* input real oculto */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls"
              className="hidden"
              onChange={handleFileChange}
            />

            <div className="mt-3 flex justify-end gap-2 text-[11px]">
              <button
                type="button"
                onClick={() => setShowUploadModal(false)}
                className="rounded-md border border-slate-700 bg-slate-900 px-3 py-1.5 text-slate-200 hover:border-slate-500"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
