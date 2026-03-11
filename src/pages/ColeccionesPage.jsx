import { Icon } from "@iconify/react";
import { useListarGuardadosQuery } from "../stack/ColeccionesStack";
import { SpinnerLocal } from "../components/ui/spinners/SpinnerLocal";
import { useComentariosStore } from "../store/ComentariosStore";
import { ComentarioModal } from "../components/HomePageComponents/ComentarioModal";
import { PublicacionCard } from "../components/HomePageComponents/PublicacionCard";

export const ColeccionesPage = () => {
  const { data: guardados = [], isLoading } = useListarGuardadosQuery();
  const { showModal } = useComentariosStore();

  // Transforma los guardados al mismo shape que espera PublicacionCard
  const posts = guardados
    .map((item) => {
      const p = item.publicaciones;
      if (!p) return null;
      return {
        ...p,
        nombre_usuario: p.usuarios?.nombre,
        foto_usuario: p.usuarios?.foto_perfil,
      };
    })
    .filter(Boolean);

  return (
    <main className="flex flex-col h-screen overflow-hidden">
      {showModal && <ComentarioModal />}
      <div className="overflow-y-auto h-full border-x border-gray-200 dark:border-gray-600">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white dark:bg-bg-dark border-b border-gray-200 dark:border-gray-600 px-4 py-4">
          <div className="flex items-center gap-3">
            <Icon
              icon="mdi:bookmark-multiple"
              className="text-2xl text-primary"
            />
            <div>
              <h1 className="text-xl font-bold">Guardados</h1>
              <p className="text-xs text-gray-400">
                {posts.length}{" "}
                {posts.length === 1
                  ? "publicación guardada"
                  : "publicaciones guardadas"}
              </p>
            </div>
          </div>
        </div>

        {/* Contenido */}
        {isLoading ? (
          <SpinnerLocal />
        ) : posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-gray-400">
            <Icon icon="mdi:bookmark-outline" className="text-6xl" />
            <div className="text-center">
              <p className="font-semibold">Aún no tienes nada guardado</p>
              <p className="text-sm mt-1">
                Guarda publicaciones para verlas más tarde
              </p>
            </div>
          </div>
        ) : (
          posts.map((post) => <PublicacionCard key={post.id} item={post} />)
        )}
      </div>
    </main>
  );
};
