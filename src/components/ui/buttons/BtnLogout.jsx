import { Icon } from "@iconify/react";

export const BtnLogout = () => {
  return (
    <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-red-400 dark:hover:bg-primery/20 transition-all justify-center sm:justify-start cursor-pointer">
      <Icon icon={"solar:logout-2-bold-duotone"} width={24} height={24} />
      <span className="hidden sm:block">Cerrar Sesión</span>
    </div>
  );
};
