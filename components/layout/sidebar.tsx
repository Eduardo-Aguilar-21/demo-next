"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Route,
  Clock3,
  Settings,
  Users,
  Map,
  ListChecks,
  FileText,
  Bell,
  Building2,
  UserRound,
  AlertTriangle,
  ReceiptText,
  ClipboardList,
} from "lucide-react";
import { cn } from "@/lib/utils";

type AppRole = "admin" | "driver" | "passenger" | "corporate";

type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

type RoleConfig = {
  title: string;
  ariaLabel: string;
  items: NavItem[];
};

const ROLE_CONFIG: Record<AppRole, RoleConfig> = {
  /** ADMINISTRADOR – RF01..RF10 */
  admin: {
    title: "Administración",
    ariaLabel: "Navegación principal administrador",
    items: [
      /*{
        href: "/app/admin",
        label: "Dashboard",
        icon: LayoutDashboard,
      },*/
      {
        href: "/app/admin/users",
        label: "Usuarios",
        icon: Users, // RF01
      },
      {
        href: "/app/admin/routes",
        label: "Rutas y puntos",
        icon: Route, // RF02–RF03
      },
      {
        href: "/app/admin/passenger-lists",
        label: "Listas de pasajeros",
        icon: ListChecks, // RF04
      },
      {
        href: "/app/admin/map",
        label: "Unidades en mapa",
        icon: Map, // RF05
      },
      /*
      {
        href: "/app/admin/reports",
        label: "Reportes",
        icon: FileText, // RF06
      },*/
      /*{
        href: "/app/admin/notifications",
        label: "Notificaciones",
        icon: Bell, // RF07
      },*/
      /*
      {
        href: "/app/admin/corporate-clients",
        label: "Clientes corporativos",
        icon: Building2, // RF09–RF10
      },
      */
      /*
      {
        href: "/app/admin/settings",
        label: "Configuración",
        icon: Settings,
      },*/
    ],
  },

  /** CONDUCTOR – RF09..RF16 */
  driver: {
    title: "Driver Panel",
    ariaLabel: "Navegación principal conductor",
    items: [
      {
        href: "/app/driver",
        label: "Dashboard",
        icon: LayoutDashboard,
      },
      {
        href: "/app/driver/today",
        label: "Viajes de hoy",
        icon: Route, // rutas programadas, “estoy en camino”, etc.
      },
      {
        href: "/app/driver/history",
        label: "Historial",
        icon: Clock3, // viajes pasados, evidencias
      },
      {
        href: "/app/driver/settings",
        label: "Configuración",
        icon: Settings,
      },
    ],
  },

  /** PASAJERO – RF17..RF21 */
  passenger: {
    title: "Pasajero",
    ariaLabel: "Navegación principal pasajero",
    items: [
      {
        href: "/app/passenger",
        label: "Inicio",
        icon: LayoutDashboard, // próximo viaje, estado actual
      },
      {
        href: "/app/passenger/requests",
        label: "Solicitar viaje",
        icon: Route, // si manejas solicitudes tipo Uber
      },
      {
        href: "/app/passenger/trips",
        label: "Mis viajes",
        icon: Clock3, // historial + confirmación de abordo / cancelación
      },
      {
        href: "/app/passenger/settings",
        label: "Cuenta",
        icon: UserRound,
      },
    ],
  },

  /** CLIENTE CORPORATIVO – RF41..RF47 */
  corporate: {
    title: "Cliente corporativo",
    ariaLabel: "Navegación principal cliente corporativo",
    items: [
      {
        href: "/app/corporate",
        label: "Dashboard",
        icon: LayoutDashboard,
      },
      {
        href: "/app/corporate/passengers",
        label: "Pasajeros del día",
        icon: ClipboardList, // RF42 + RF43
      },
      {
        href: "/app/corporate/incidents",
        label: "Incidencias",
        icon: AlertTriangle, // RF44
      },
      {
        href: "/app/corporate/routes",
        label: "Rutas y conductores",
        icon: Route, // RF45
      },
      {
        href: "/app/corporate/reports",
        label: "Costos y reportes",
        icon: ReceiptText, // RF46–RF47
      },
      {
        href: "/app/corporate/settings",
        label: "Configuración",
        icon: Settings,
      },
    ],
  },
};

export function Sidebar({ role }: { role: AppRole }) {
  const pathname = usePathname();
  const config = ROLE_CONFIG[role];

  return (
    <>
      {/* SIDEBAR DESKTOP */}
      <aside className="hidden w-60 border-r border-slate-800 bg-slate-950 md:flex md:flex-col">
        <div className="flex h-14 items-center border-b border-slate-800 px-4">
          <span className="text-lg font-semibold tracking-tight">{config.title}</span>
        </div>

        <nav className="flex-1 space-y-1 px-2 py-4">
          {config.items.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href || pathname.startsWith(item.href + "/");

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition",
                  active
                    ? "bg-slate-800 text-slate-50"
                    : "text-slate-400 hover:bg-slate-900 hover:text-slate-100"
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* NAV INFERIOR MÓVIL */}
      <nav
        aria-label={config.ariaLabel}
        className="fixed inset-x-0 bottom-0 z-30 flex h-14 items-center justify-around border-t border-slate-800 bg-slate-950/95 text-[11px] text-slate-300 backdrop-blur md:hidden"
      >
        {config.items.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href || pathname.startsWith(item.href + "/");

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-1 flex-col items-center justify-center gap-0.5 transition-colors",
                active ? "text-emerald-400" : "text-slate-500"
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}

/** Si quieres 4 componentes explícitos, puedes exportarlos así: */
export const AdminSidebar = () => <Sidebar role="admin" />;
export const DriverSidebar = () => <Sidebar role="driver" />;
export const PassengerSidebar = () => <Sidebar role="passenger" />;
export const CorporateSidebar = () => <Sidebar role="corporate" />;
