import { useState } from "react";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";
import { useListarSeguidoresQuery, useListarSiguiendoQuery } from "../stack/UsuariosStack";
import { useUsuariosStore } from "../store/UsuariosStore";
import { SpinnerLocal } from "./ui/spinners/SpinnerLocal";

export const SeguidoresModal = ({ id_usuario, tab: initialTab, onClose }) => {
  const [tab, setTab] = useState(initialTab || "seguidores");
  const [busqueda, setBusqueda] = useState("");
  const navigate = useNavigate();
  const { dataUsuarioAuth } = useUsuariosStore();

  const { data: seguidores = [], isLoading: loadingSeguidores } =
    useListarSeguidoresQuery(id_usuario);
  const { data: siguiendo = [], isLoading: loadingSiguiendo } =
    useListarSiguiendoQuery(id_usuario);

  const lista = tab === "seguidores" ? seguidores : siguiendo;
  const isLoading = tab === "seguidores" ? loadingSeguidores : loadingSiguiendo;

  const filtrados = busqueda.trim()
    ? lista.filter((u) =>
        u.nombre.toLowerCase().includes(busqueda.toLowerCase())
      )
    : lista;

  const irAlPerfil = (id) => {
    onClose();
    if (id === dataUsuarioAuth?.id) {
      navigate("/mi-perfil");
    } else {
      navigate(`/perfil/${id}`);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-neutral-900 rounded-xl w-full max-w-sm max-h-[70vh] flex flex-col relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 text-gray-400 hover:text-gray-600 cursor-pointer"
        >
          <Icon icon="mdi:close" className="text-xl" />
        </button>

        {/* Header con tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <div className="flex">
            <button
              onClick={() => { setTab("seguidores"); setBusqueda(""); }}
              className={`flex-1 py-3 text-sm font-semibold transition-colors cursor-pointer ${
                tab === "seguidores"
                  ? "text-primary border-b-2 border-primary"
                  : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              }`}
            >
              Seguidores ({seguidores.length})
            </button>
            <button
              onClick={() => { setTab("siguiendo"); setBusqueda(""); }}
              className={`flex-1 py-3 text-sm font-semibold transition-colors cursor-pointer ${
                tab === "siguiendo"
                  ? "text-primary border-b-2 border-primary"
                  : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              }`}
            >
              Siguiendo ({siguiendo.length})
            </button>
          </div>
        </div>

        {/* Buscador */}
        <div className="px-4 py-3">
          <div className="relative">
            <Icon
              icon="mdi:magnify"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar..."
              className="w-full pl-9 pr-4 py-2 bg-gray-100 dark:bg-neutral-800 rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary placeholder-gray-400"
            />
          </div>
        </div>

        {/* Lista */}
        <div className="flex-1 overflow-y-auto px-2 pb-3">
          {isLoading ? (
            <SpinnerLocal />
          ) : filtrados.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-gray-400">
              <Icon icon="mdi:account-search-outline" className="text-4xl mb-2" />
              <p className="text-sm">
                {busqueda.trim()
                  ? "No se encontraron resultados"
                  : tab === "seguidores"
                  ? "Aún no tiene seguidores"
                  : "Aún no sigue a nadie"}
              </p>
            </div>
          ) : (
            filtrados.map((usuario) => (
              <button
                key={usuario.id}
                onClick={() => irAlPerfil(usuario.id)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                <img
                  src={usuario.foto_perfil || "https://placehold.co/40x40"}
                  onError={(e) => (e.target.src = "https://placehold.co/40x40")}
                  alt={usuario.nombre}
                  className="w-10 h-10 rounded-full object-cover shrink-0"
                />
                <span className="font-medium text-sm truncate">
                  {usuario.nombre}
                </span>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
