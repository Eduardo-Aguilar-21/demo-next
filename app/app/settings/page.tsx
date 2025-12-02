"use client";

export default function SettingsPage() {
  return (
    <div className="flex h-full min-h-0 flex-col gap-4 pb-16 md:pb-6">
      <div className="space-y-1">
        <h1 className="text-lg font-semibold tracking-tight sm:text-xl">Configuración</h1>
        <p className="max-w-xl text-xs text-slate-400 sm:text-sm">
          Pantalla de configuración demo. Aquí irán opciones generales del sistema.
        </p>
      </div>

      <section className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 text-xs shadow-sm">
        <p className="text-[11px] text-slate-400">
          (Placeholder) Aún no hay configuración implementada.
        </p>
      </section>
    </div>
  );
}
