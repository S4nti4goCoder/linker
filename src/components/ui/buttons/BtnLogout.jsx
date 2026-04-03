import { Icon } from "@iconify/react";
import { useAuthStore } from "../../../store/AuthStore";

export const BtnLogout = () => {
  const { cerrarSesion } = useAuthStore();
  return (
    <button
      className="flex items-center gap-3 p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10 dark:hover:text-red-400 transition-all justify-center sm:justify-start cursor-pointer w-full"
      onClick={cerrarSesion}
    >
      <Icon icon="mdi:logout" width={22} height={22} />
      <span className="hidden sm:block text-sm font-medium">Cerrar sesión</span>
    </button>
  );
};
