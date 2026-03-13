import { HeaderSticky } from "../components/HomePageComponents/HeaderSticky";
import { InputPublicar } from "../components/HomePageComponents/InputPublicar";
import { PublicacionCard } from "../components/HomePageComponents/PublicacionCard";
import {
  useMostrarPostQuery,
  useMostrarPostSeguidosQuery,
} from "../stack/PostStack";
import { useEffect, useRef, useState, useMemo } from "react";
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

// Opciones estables fuera del componente para evitar recreación en cada render
const SUBS = [
  {
    channelName: "public:publicaciones",
    table: "publicaciones",
    queryKey: ["mostrar post"],
  },
  {
    channelName: "public:respuestas_comentarios",
    table: "respuestas_comentarios",
    queryKey: ["mostrar respuesta comentario"],
  },
  {
    channelName: "public:usuarios",
    table: "usuarios",
    queryKey: ["contar usuarios todos"],
  },
  {
    channelName: "public:likes_comentarios",
    table: "likes_comentarios",
    queryKey: ["likes comentario"],
  },
];

export const HomePage = () => {
  const { dataUsuarioAuth } = useUsuariosStore();
  const { showModal } = useComentariosStore();
  const { itemSelect: itemSelectPost } = usePostStore();
  const [tab, setTab] = useState("todos");

  useMostrarRespuestaComentariosQuery();

  const {
    data: dataPost,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isLoadingPost,
  } = useMostrarPostQuery();

  const { data: idsSeguidosData } = useSeguidosQuery(dataUsuarioAuth?.id);
  const idsSeguidos = idsSeguidosData ?? [];

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
      if (tab === "todos" && cerca && hasNextPage && !isFetchingNextPage)
        fetchNextPage();
      if (
        tab === "siguiendo" &&
        cerca &&
        hasNextSeguidos &&
        !isFetchingNextSeguidos
      )
        fetchNextSeguidos();
    };
    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, [
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    fetchNextSeguidos,
    hasNextSeguidos,
    isFetchingNextSeguidos,
    tab,
  ]);

  // Suscripciones estables (options fuera del componente)
  SUBS.forEach(({ channelName, table, queryKey }) => {
    useSupabaseSubscription({
      channelName,
      options: { event: "*", schema: "public", table },
      queryKey,
    });
  });

  // Esta suscripción depende de datos dinámicos — se estabiliza con useMemo
  const comentariosQueryKey = useMemo(
    () => ["mostrar comentarios", { id_publicacion: itemSelectPost?.id }],
    [itemSelectPost?.id],
  );
  useSupabaseSubscription({
    channelName: "public:comentarios",
    options: { event: "*", schema: "public", table: "comentarios" },
    queryKey: comentariosQueryKey,
  });

  const seguidoresQueryKey = useMemo(
    () => ["seguidos", dataUsuarioAuth?.id],
    [dataUsuarioAuth?.id],
  );
  useSupabaseSubscription({
    channelName: "public:seguidores",
    options: { event: "*", schema: "public", table: "seguidores" },
    queryKey: seguidoresQueryKey,
  });

  const postsTodos = dataPost?.pages?.flatMap((p) => p) ?? [];
  const postsSeguidos = dataPostSeguidos?.pages?.flatMap((p) => p) ?? [];

  return (
    <main className="flex min-h-screen bg-white dark:bg-bg-dark max-w-[1200px] mx-auto">
      {dataUsuarioAuth?.foto_perfil === "-" && <FormActualizarPerfil />}
      <section className="flex flex-col w-full h-screen">
        <article className="flex flex-col h-screen overflow-hidden border border-gray-200 border-t-0 border-b-0 dark:border-gray-600">
          <HeaderSticky />

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

            {tab === "todos" && (
              <>
                {isLoadingPost && (
                  <>
                    <SkeletonPost />
                    <SkeletonPost />
                    <SkeletonPost />
                    <SkeletonPost />
                  </>
                )}
                {!isLoadingPost &&
                  postsTodos.map((item) => (
                    <PublicacionCard key={item.id} item={item} />
                  ))}
                {isFetchingNextPage && <SpinnerLocal />}
              </>
            )}

            {tab === "siguiendo" && (
              <>
                {isLoadingSeguidos && <SkeletonPost />}
                {!isLoadingSeguidos && idsSeguidos.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-3">
                    <Icon
                      icon="mdi:account-multiple-outline"
                      className="text-5xl"
                    />
                    <p className="text-sm">
                      Sigue a alguien para ver sus publicaciones
                    </p>
                  </div>
                )}
                {!isLoadingSeguidos &&
                  idsSeguidos.length > 0 &&
                  postsSeguidos.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-3">
                      <Icon icon="mdi:post-outline" className="text-5xl" />
                      <p className="text-sm">
                        Las personas que sigues aún no han publicado
                      </p>
                    </div>
                  )}
                {!isLoadingSeguidos &&
                  postsSeguidos.map((item) => (
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
