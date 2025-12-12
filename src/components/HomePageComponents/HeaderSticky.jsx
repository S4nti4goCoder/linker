import { Icon } from "@iconify/react";
import { useContarUsuariosTodosQuery } from "../../stack/UsuariosStack";

export const HeaderSticky = () => {
  const { data: cantidadUsuarios } = useContarUsuariosTodosQuery();
  return (
    <div className="sticky top-0 z-10 border-b border-gray-200 dark:border-gray-600 px-4 py-3">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">INICIO</h1>
        <button className="flex gap-2">
          <span className="font-semibold text-gray-500/80">({cantidadUsuarios}) usuarios</span>
          <Icon icon="mdi:dots-vertical" className="text-2xl text-gray-400" />
        </button>
      </div>
    </div>
  );
};
