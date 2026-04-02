import { Icon } from "@iconify/react";
import { NavLink } from "react-router-dom";
import { BtnToggleTheme } from "../ui/buttons/BtnToggleTheme";
import { BtnLogout } from "../ui/buttons/BtnLogout";
import { BtnNewPost } from "../ui/buttons/BtnNewPost";
import { NotificacionesDropdown } from "./NotificacionesDropdown";
import { useListarConversacionesQuery } from "../../stack/MensajesStack";

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

export const Sidebar = () => {
  const { data: conversaciones = [] } = useListarConversacionesQuery();
  const totalNoLeidos = conversaciones.reduce(
    (acc, c) => acc + (c.no_leidos ?? 0),
    0,
  );

  return (
    <div className="h-screen p-2 bg-white dark:bg-bg-dark transition-all duration-300 flex flex-col">
      <div className="flex justify-center items-center h-8 w-8 rounded-full m-2 overflow-hidden">
        <img src="/favicon.svg" alt="LinKer" className="w-full h-full" />
      </div>
      <nav aria-label="Navegación principal" className="flex-1 flex flex-col gap-2 items-center">
        {linksActivos.map((item, index) => (
          <NavLink
            key={index}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 p-2 rounded-lg font-semibold hover:bg-gray-100 dark:hover:bg-primary/10 dark:hover:text-primary transition-all w-full justify-center sm:justify-start ${
                isActive
                  ? "text-blue-600 dark:text-white"
                  : "text-gray-600 dark:text-gray-400"
              }`
            }
          >
            <div className="relative">
              <Icon icon={item.icon} width={24} height={24} />
              {item.to === "/mensajes" && totalNoLeidos > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {totalNoLeidos > 9 ? "9+" : totalNoLeidos}
                </span>
              )}
            </div>
            <span className="hidden sm:block text-sm">{item.label}</span>
          </NavLink>
        ))}

        <div className="w-full border-t border-gray-200 dark:border-gray-700 my-1" />

        {/* Notificaciones */}
        <NotificacionesDropdown />
      </nav>

      <BtnToggleTheme />
      <BtnLogout />
      <BtnNewPost />
    </div>
  );
};
