import { Icon } from "@iconify/react";
import { usePostStore } from "../../store/PostStore";
import { useUsuariosStore } from "../../store/UsuariosStore";

export const InputPublicar = () => {
  const { setStateForm } = usePostStore();
  const { dataUsuarioAuth } = useUsuariosStore();

  return (
    <div className="p-4 border-b border-gray-200 dark:border-gray-600">
      <div className="flex items-center gap-3">
        <img
          src={dataUsuarioAuth?.foto_perfil || "https://placehold.co/40x40"}
          className="w-10 h-10 rounded-full object-cover shrink-0"
        />
        <button
          onClick={() => setStateForm(true)}
          className="flex-1 text-left px-4 py-2.5 rounded-full bg-gray-100 dark:bg-neutral-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-neutral-700 transition-all cursor-pointer text-sm"
        >
          ¿Qué estás pensando, {dataUsuarioAuth?.nombre?.split(" ")[0]}?
        </button>
      </div>
      <div className="flex gap-2 sm:gap-4 md:gap-6 mt-3 pt-3 border-t border-gray-200 dark:border-gray-600 ml-10 sm:ml-13">
        <button
          onClick={() => setStateForm(true)}
          className="flex items-center gap-2 text-gray-500 hover:text-primary hover:bg-gray-100 dark:hover:bg-neutral-800 px-3 py-1.5 rounded-lg transition-all cursor-pointer text-sm font-medium"
        >
          <Icon icon="mdi:image-outline" className="text-xl text-green-500" />
          <span className="hidden sm:block">Foto/Video</span>
        </button>
        <button
          onClick={() => setStateForm(true)}
          className="flex items-center gap-2 text-gray-500 hover:text-primary hover:bg-gray-100 dark:hover:bg-neutral-800 px-3 py-1.5 rounded-lg transition-all cursor-pointer text-sm font-medium"
        >
          <Icon
            icon="mdi:emoticon-outline"
            className="text-xl text-yellow-500"
          />
          <span className="hidden sm:block">Sentimiento</span>
        </button>
        <button
          onClick={() => setStateForm(true)}
          className="flex items-center gap-2 text-gray-500 hover:text-primary hover:bg-gray-100 dark:hover:bg-neutral-800 px-3 py-1.5 rounded-lg transition-all cursor-pointer text-sm font-medium"
        >
          <Icon
            icon="mdi:map-marker-outline"
            className="text-xl text-red-500"
          />
          <span className="hidden sm:block">Ubicación</span>
        </button>
      </div>
    </div>
  );
};
