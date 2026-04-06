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
import { FormActualizarPerfil } from "../components/Forms/FormActualizarPerfil";
import { useUsuariosStore } from "../store/UsuariosStore";
import { useSeguidosQuery } from "../stack/UsuariosStack";
import { Icon } from "@iconify/react";
import { usePostStore } from "../store/PostStore";

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

const HomePage = () => {
  const { dataUsuarioAuth } = useUsuariosStore();
  const { showModal } = useComentariosStore();
  const { itemSelect: itemSelectPost } = usePostStore();
  const [tab, setTab] = useState("todos");
  const [showOnboarding, setShowOnboarding] = useState(true);

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

  const sentinelRef = useRef(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        if (tab === "todos" && hasNextPage && !isFetchingNextPage)
          fetchNextPage();
        if (tab === "siguiendo" && hasNextSeguidos && !isFetchingNextSeguidos)
          fetchNextSeguidos();
      },
      { root: scrollRef.current, rootMargin: "200px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    fetchNextSeguidos,
    hasNextSeguidos,
    isFetchingNextSeguidos,
    tab,
  ]);

  useSupabaseSubscription({
    channelName: SUBS[0].channelName,
    options: { event: "*", schema: "public", table: SUBS[0].table },
    queryKey: SUBS[0].queryKey,
  });
  useSupabaseSubscription({
    channelName: SUBS[1].channelName,
    options: { event: "*", schema: "public", table: SUBS[1].table },
    queryKey: SUBS[1].queryKey,
  });
  useSupabaseSubscription({
    channelName: SUBS[2].channelName,
    options: { event: "*", schema: "public", table: SUBS[2].table },
    queryKey: SUBS[2].queryKey,
  });
  useSupabaseSubscription({
    channelName: SUBS[3].channelName,
    options: { event: "*", schema: "public", table: SUBS[3].table },
    queryKey: SUBS[3].queryKey,
  });

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
    <div className="flex flex-col h-full overflow-hidden">
      {dataUsuarioAuth?.foto_perfil === "-" && showOnboarding && <FormActualizarPerfil onClose={() => setShowOnboarding(false)} />}
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

      <div ref={scrollRef} className="overflow-y-auto flex-1">
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

        <div ref={sentinelRef} className="h-1" />
      </div>

      {showModal && <ComentarioModal />}
    </div>
  );
};

export default HomePage;
