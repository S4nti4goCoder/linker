import { Icon } from "@iconify/react";
import logo from "../../assets/logo.png";
import { NavLink, useLocation } from "react-router-dom";
import { BtnToggleTheme } from "../ui/buttons/BtnToggleTheme";
import { BtnLogout } from "../ui/buttons/BtnLogout";
import { BtnNewPost } from "../ui/buttons/BtnNewPost";
import { NotificacionesDropdown } from "./NotificacionesDropdown";
import { useListarConversacionesQuery } from "../../stack/MensajesStack";
import { useState, useEffect } from "react";
import { CREATOR_GITHUB, CREATOR_GITHUB_URL, isCreator } from "../../utils/creator";
import { useUsuariosStore } from "../../store/UsuariosStore";
import { useReportesPendientesQuery } from "../../stack/ReportesStack";

const linksActivos = [
  { label: "Inicio", icon: "ic:baseline-home", to: "/" },
  { label: "Mi perfil", icon: "ic:baseline-account-circle", to: "/mi-perfil" },
  { label: "Mensajes", icon: "ic:baseline-message", to: "/mensajes" },
  {
    label: "Colecciones",
    icon: "ic:baseline-collections-bookmark",
    to: "/colecciones",
  },
];

const SidebarContent = ({ totalNoLeidos, totalReportes, esCreador, onNavigate }) => (
  <>
    <div className="flex items-center gap-2 px-2 py-3">
      <img src={logo} alt="LinKer logo" className="h-8 w-8 shrink-0" />
      <span className="text-xl font-bold tracking-tight">LinKer</span>
    </div>
    <nav aria-label="Navegación principal" className="flex-1 flex flex-col gap-2">
      {linksActivos.map((item, index) => (
        <NavLink
          key={index}
          to={item.to}
          onClick={onNavigate}
          className={({ isActive }) =>
            `relative flex items-center gap-3 p-2 rounded-lg font-semibold hover:bg-gray-100 dark:hover:bg-primary/10 dark:hover:text-primary transition-all w-full ${
              isActive
                ? "text-primary bg-primary/5 dark:bg-primary/10 dark:text-white"
                : "text-gray-600 dark:text-gray-400"
            }`
          }
        >
          {({ isActive }) => (
            <>
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-primary rounded-r-full" />
              )}
              <div className="relative">
                <Icon icon={item.icon} width={24} height={24} />
                {item.to === "/mensajes" && totalNoLeidos > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {totalNoLeidos > 9 ? "9+" : totalNoLeidos}
                  </span>
                )}
              </div>
              <span className="text-sm">{item.label}</span>
            </>
          )}
        </NavLink>
      ))}

      {esCreador && (
        <>
          <div className="w-full border-t border-gray-200 dark:border-gray-700 my-1" />
          <NavLink
            to="/admin"
            onClick={onNavigate}
            className={({ isActive }) =>
              `relative flex items-center gap-3 p-2 rounded-lg font-semibold hover:bg-gray-100 dark:hover:bg-primary/10 dark:hover:text-primary transition-all w-full ${
                isActive
                  ? "text-primary bg-primary/5 dark:bg-primary/10 dark:text-white"
                  : "text-gray-600 dark:text-gray-400"
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-primary rounded-r-full" />
                )}
                <div className="relative">
                  <Icon icon="mdi:shield-crown-outline" width={24} height={24} />
                  {totalReportes > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {totalReportes > 9 ? "9+" : totalReportes}
                    </span>
                  )}
                </div>
                <span className="text-sm">Administración</span>
              </>
            )}
          </NavLink>
        </>
      )}

      <div className="w-full border-t border-gray-200 dark:border-gray-700 my-1" />
      <NotificacionesDropdown />
    </nav>

    <div className="border-t border-gray-200 dark:border-gray-700 pt-2 mt-1 flex flex-col gap-1">
      <BtnToggleTheme />
      <BtnLogout />
    </div>
    <BtnNewPost />
    <a
      href={CREATOR_GITHUB_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-center gap-1 text-[10px] text-gray-400 hover:text-primary transition-colors mt-2 pb-1"
    >
      Hecho con
      <Icon icon="mdi:heart" className="text-red-400 text-xs" />
      por
      <span className="font-medium">{CREATOR_GITHUB}</span>
    </a>
  </>
);

export const Sidebar = () => {
  const { data: conversaciones = [] } = useListarConversacionesQuery();
  const { dataUsuarioAuth } = useUsuariosStore();
  const esCreador = isCreator(dataUsuarioAuth?.id);
  const { data: reportes = [] } = useReportesPendientesQuery(esCreador);
  const totalNoLeidos = conversaciones.reduce(
    (acc, c) => acc + (c.no_leidos ?? 0),
    0,
  );
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  return (
    <>
      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 py-2 bg-white dark:bg-bg-dark border-b border-gray-200 dark:border-gray-600">
        <button
          onClick={() => setOpen(true)}
          className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-800 cursor-pointer"
          aria-label="Abrir menú"
        >
          <Icon icon="mdi:menu" width={24} height={24} />
        </button>
        <div className="flex items-center gap-2">
          <img src={logo} alt="LinKer" className="h-7 w-7" />
          <span className="text-lg font-bold tracking-tight">LinKer</span>
        </div>
        <div className="w-9" />
      </div>

      {/* Mobile overlay */}
      {open && (
        <div
          className="md:hidden fixed inset-0 z-50 bg-black/50 animate-fade-in"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-60 h-full p-3 bg-white dark:bg-bg-dark flex flex-col animate-slide-in"
            onClick={(e) => e.stopPropagation()}
          >
            <SidebarContent totalNoLeidos={totalNoLeidos} totalReportes={reportes.length} esCreador={esCreador} onNavigate={() => setOpen(false)} />
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden md:flex h-screen w-[200px] shrink-0 p-2 bg-white dark:bg-bg-dark transition-all duration-300 flex-col">
        <SidebarContent totalNoLeidos={totalNoLeidos} totalReportes={reportes.length} esCreador={esCreador} />
      </div>
    </>
  );
};
