import { Toaster } from "sonner";
import { HeaderSticky } from "../components/HomePageComponents/HeaderSticky";
import { InputPublicar } from "../components/HomePageComponents/InputPublicar";
import { PublicacionCard } from "../components/HomePageComponents/PublicacionCard";
import { useMostrarPostQuery, useMostrarPostSeguidosQuery } from "../stack/PostStack";
import { useEffect, useRef, useState } from "react";
import { SpinnerLocal } from "../components/ui/spinners/SpinnerLocal";
import { SkeletonPost } from "../components/ui/spinners/SkeletonPost";
import { useSupabaseSubscription } from "../hooks/useSupabaseSubscription";
import { ComentarioModal } from "../components/HomePageComponents/ComentarioModal";
import { useComentariosStore } from "../store/ComentariosStore";
import { useMostrarRespuestaComentariosQuery } from "../stack/RespuestasComentariosStack";
import { FormActualizarPerfil } from "../components/Forms/FormActualizarPerfil";
import { useUsuariosStore } from "../store/UsuariosStore";
import { useSeguidosQuery } from "../stack/UsuariosStack";
import { Icon } from "@iconify/react";
import { usePostStore } from "../store/PostStore";

export const HomePage = () => {
  const { dataUsuarioAuth } = useUsuariosStore();
  const { showModal } = useComentariosStore();
  const { itemSelect: itemSelectPost } = usePostStore();
  const [tab, setTab] = useState("todos");

  useMostrarRespuestaComentariosQuery();

  // Feed todos
  const {
    data: dataPost,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isLoadingPost,
  } = useMostrarPostQuery();

  // IDs de seguidos
  const { data: idsSeguidosData } = useSeguidosQuery(dataUsuarioAuth?.id);
  const idsSeguidos = idsSeguidosData ?? [];

  // Feed siguiendo
  const {
    data: dataPostSeguidos,
    fetchNextPage: fetchNextSeguidos,
    hasNextPage: hasNextSeguidos,
    isFetchingNextPage: isFetchingNextSeguidos,
    isLoading: isLoadingSeguidos,
  } = useMostrarPostSeguidosQuery(idsSeguidos);

  const scrollRef = useRef(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const handleScroll = () => {
      const cerca = el.scrollTop + el.clientHeight >= el.scrollHeight - 200;
      if (tab === "todos" && cerca && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
      if (tab === "siguiendo" && cerca && hasNextSeguidos && !isFetchingNextSeguidos) {
        fetchNextSeguidos();
      }
    };
    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, [fetchNextPage, hasNextPage, isFetchingNextPage, fetchNextSeguidos, hasNextSeguidos, isFetchingNextSeguidos, tab]);

  useSupabaseSubscription({
    channelName: "public:publicaciones",
    options: { event: "*", schema: "public", table: "publicaciones" },
    queryKey: ["mostrar post"],
  });
  useSupabaseSubscription({
    channelName: "public:comentarios",
    options: { event: "*", schema: "public", table: "comentarios" },
    queryKey: ["mostrar comentarios", { id_publicacion: itemSelectPost?.id }],
  });
  useSupabaseSubscription({
    channelName: "public:respuestas_comentarios",
    options: { event: "*", schema: "public", table: "respuestas_comentarios" },
    queryKey: ["mostrar respuesta comentario"],
  });
  useSupabaseSubscription({
    channelName: "public:usuarios",
    options: { event: "*", schema: "public", table: "usuarios" },
    queryKey: ["contar usuarios todos"],
  });
  useSupabaseSubscription({
    channelName: "public:likes_comentarios",
    options: { event: "*", schema: "public", table: "likes_comentarios" },
    queryKey: ["likes comentario"],
  });
  useSupabaseSubscription({
    channelName: "public:seguidores",
    options: { event: "*", schema: "public", table: "seguidores" },
    queryKey: ["seguidos", dataUsuarioAuth?.id],
  });

  const postsTodos = dataPost?.pages?.flatMap((p) => p) ?? [];
  const postsSeguidos = dataPostSeguidos?.pages?.flatMap((p) => p) ?? [];

  return (
    <main className="flex min-h-screen bg-white dark:bg-bg-dark max-w-[1200px] mx-auto">
      {dataUsuarioAuth?.foto_perfil === "-" && <FormActualizarPerfil />}
      <Toaster position="top-left" />
      <section className="flex flex-col w-full h-screen">
        <article className="flex flex-col h-screen overflow-hidden border border-gray-200 border-t-0 border-b-0 dark:border-gray-600">
          <HeaderSticky />

          {/* Pestañas */}
          <div className="flex border-b border-gray-200 dark:border-gray-600 shrink-0">
            <button
              onClick={() => setTab("todos")}
              className={`flex-1 py-3 text-sm font-semibold transition-colors cursor-pointer ${
                tab === "todos"
                  ? "text-primary border-b-2 border-primary"
                  : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              }`}
            >
              Para ti
            </button>
            <button
              onClick={() => setTab("siguiendo")}
              className={`flex-1 py-3 text-sm font-semibold transition-colors cursor-pointer ${
                tab === "siguiendo"
                  ? "text-primary border-b-2 border-primary"
                  : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              }`}
            >
              Siguiendo
            </button>
          </div>

          <div ref={scrollRef} className="overflow-y-auto">
            <InputPublicar />

            {/* Pestaña: Para ti */}
            {tab === "todos" && (
              <>
                {isLoadingPost && (
                  <> <SkeletonPost /> <SkeletonPost /> <SkeletonPost /> <SkeletonPost /> </>
                )}
                {!isLoadingPost && postsTodos.map((item) => (
                  <PublicacionCard key={item.id} item={item} />
                ))}
                {isFetchingNextPage && <SpinnerLocal />}
              </>
            )}

            {/* Pestaña: Siguiendo */}
            {tab === "siguiendo" && (
              <>
                {isLoadingSeguidos && <SkeletonPost />}
                {!isLoadingSeguidos && idsSeguidos.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-3">
                    <Icon icon="mdi:account-multiple-outline" className="text-5xl" />
                    <p className="text-sm">Sigue a alguien para ver sus publicaciones</p>
                  </div>
                )}
                {!isLoadingSeguidos && idsSeguidos.length > 0 && postsSeguidos.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-3">
                    <Icon icon="mdi:post-outline" className="text-5xl" />
                    <p className="text-sm">Las personas que sigues aún no han publicado</p>
                  </div>
                )}
                {!isLoadingSeguidos && postsSeguidos.map((item) => (
                  <PublicacionCard key={item.id} item={item} />
                ))}
                {isFetchingNextSeguidos && <SpinnerLocal />}
              </>
            )}
          </div>
        </article>
      </section>
      {showModal && <ComentarioModal />}
    </main>
  );
};