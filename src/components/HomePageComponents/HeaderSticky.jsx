import { Icon } from "@iconify/react";
import { useContarUsuariosTodosQuery } from "../../stack/UsuariosStack";
import { useUsuariosStore } from "../../store/UsuariosStore";

export const HeaderSticky = () => {
  const { data: cantidadUsuarios } = useContarUsuariosTodosQuery();
  const { dataUsuarioAuth } = useUsuariosStore();

  return (
    <div className="sticky top-0 z-10 bg-white dark:bg-bg-dark border-b border-gray-200 dark:border-gray-600 px-4 py-3">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">INICIO</h1>
        <div className="flex items-center gap-3">
          <span className="font-semibold text-gray-500/80 text-sm">
            ({cantidadUsuarios}) usuarios
          </span>
          <img
            src={dataUsuarioAuth?.foto_perfil || "https://placehold.co/32x32"}
            className="w-8 h-8 rounded-full object-cover"
          />
          <Icon icon="mdi:dots-vertical" className="text-2xl text-gray-400" />
        </div>
      </div>
    </div>
  );
};