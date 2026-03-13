import { Icon } from "@iconify/react";
import {
  useContarUsuariosTodosQuery,
  useBuscarUsuariosQuery,
} from "../../stack/UsuariosStack";
import { useUsuariosStore } from "../../store/UsuariosStore";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const BusquedaUsuarios = () => {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();
  const { dataUsuarioAuth } = useUsuariosStore();

  const { data: resultados, isLoading } = useBuscarUsuariosQuery(query);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const irAlPerfil = (id) => {
    setOpen(false);
    setQuery("");
    if (Number(id) === Number(dataUsuarioAuth?.id)) {
      navigate("/mi-perfil");
    } else {
      navigate(`/perfil/${id}`);
    }
  };

  return (
    <div className="relative" ref={ref}>
      <div className="flex items-center gap-2 bg-gray-100 dark:bg-neutral-800 rounded-full px-3 py-1.5 w-48 sm:w-64">
        <Icon icon="mdi:magnify" className="text-gray-400 text-lg shrink-0" />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="Buscar usuarios..."
          className="bg-transparent outline-none text-sm w-full placeholder-gray-400"
        />
        {query && (
          <button
            onClick={() => {
              setQuery("");
              setOpen(false);
            }}
            className="cursor-pointer"
          >
            <Icon icon="mdi:close" className="text-gray-400 text-sm" />
          </button>
        )}
      </div>

      {open && query.trim().length >= 2 && (
        <div className="absolute right-0 top-10 w-72 bg-white dark:bg-neutral-900 rounded-xl shadow-2xl border border-gray-200 dark:border-neutral-700 z-50 overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center py-6">
              <Icon
                icon="mdi:loading"
                className="animate-spin text-2xl text-gray-400"
              />
            </div>
          ) : resultados?.length === 0 ? (
            <div className="flex flex-col items-center py-6 gap-2 text-gray-400">
              <Icon icon="mdi:account-search-outline" className="text-3xl" />
              <p className="text-sm">Sin resultados</p>
            </div>
          ) : (
            <div>
              {resultados?.map((usuario) => (
                <button
                  key={usuario.id}
                  onClick={() => irAlPerfil(usuario.id)}
                  className="flex items-center gap-3 w-full px-4 py-3 hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                >
                  <img
                    src={usuario.foto_perfil || "https://placehold.co/40x40"}
                    onError={(e) =>
                      (e.target.src = "https://placehold.co/40x40")
                    }
                    className="w-10 h-10 rounded-full object-cover shrink-0"
                  />
                  <div className="text-left">
                    <p className="text-sm font-semibold">{usuario.nombre}</p>
                    {Number(usuario.id) === Number(dataUsuarioAuth?.id) && (
                      <p className="text-xs text-primary">Tú</p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export const HeaderSticky = () => {
  const { data: cantidadUsuarios } = useContarUsuariosTodosQuery();
  const { dataUsuarioAuth } = useUsuariosStore();

  return (
    <div className="sticky top-0 z-10 bg-white dark:bg-bg-dark border-b border-gray-200 dark:border-gray-600 px-4 py-3">
      <div className="flex justify-between items-center gap-3">
        <h1 className="text-xl font-bold shrink-0">INICIO</h1>
        <BusquedaUsuarios />
        <div className="flex items-center gap-3 shrink-0">
          <span className="font-semibold text-gray-500/80 text-sm hidden sm:block">
            ({cantidadUsuarios}) usuarios
          </span>
          <img
            src={dataUsuarioAuth?.foto_perfil || "https://placehold.co/32x32"}
            onError={(e) => (e.target.src = "https://placehold.co/32x32")}
            className="w-8 h-8 rounded-full object-cover"
          />
          {/* ícono mdi:dots-vertical eliminado — no tenía función */}
        </div>
      </div>
    </div>
  );
};
