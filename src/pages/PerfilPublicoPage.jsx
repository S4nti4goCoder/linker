import { useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useUsuariosStore } from "../store/UsuariosStore";
import { useMostrarPostPublicoQuery } from "../stack/PostStack";
import { PublicacionCard } from "../components/HomePageComponents/PublicacionCard";
import { SpinnerLocal } from "../components/ui/spinners/SpinnerLocal";
import { ComentarioModal } from "../components/HomePageComponents/ComentarioModal";
import { useComentariosStore } from "../store/ComentariosStore";
import { useImageExtractColor } from "../hooks/useImageExtractColor";
import { Icon } from "@iconify/react";
import {
  useToggleSeguirMutate,
  useEstadoSeguidorQuery,
  useConteoSeguidoresQuery,
  useObtenerUsuarioPorIdQuery,
} from "../stack/UsuariosStack";

const PerfilPublicoHeader = ({ usuario, id }) => {
  const imgRef = useRef(null);
  const bgColor = useImageExtractColor(imgRef, usuario?.foto_perfil);
  const { mutate: toggleSeguir, isPending } = useToggleSeguirMutate(Number(id));
  const { data: estadoSeguidor } = useEstadoSeguidorQuery(Number(id));
  const { data: conteo } = useConteoSeguidoresQuery(Number(id));

  return (
    <div className="relative">
      <div
        className="h-32 w-full transition-colors duration-500"
        style={{ backgroundColor: bgColor || "#0466c8" }}
      />
      <div className="px-4 pb-4 border-b border-gray-200 dark:border-gray-600">
        <div className="flex justify-between items-end -mt-12">
          <img
            ref={imgRef}
            src={usuario?.foto_perfil || "https://placehold.co/96x96"}
            onError={(e) => (e.target.src = "https://placehold.co/96x96")}
            crossOrigin="anonymous"
            className="w-24 h-24 rounded-full object-cover border-4 border-white dark:border-bg-dark"
          />
          <button
            onClick={() => toggleSeguir()}
            disabled={isPending}
            className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold border transition-all cursor-pointer disabled:opacity-50 ${
              estadoSeguidor?.siguiendo
                ? "border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:border-red-400 hover:text-red-400"
                : "border-primary text-primary hover:bg-primary hover:text-white"
            }`}
          >
            <Icon
              icon={
                estadoSeguidor?.siguiendo
                  ? "mdi:account-check"
                  : "mdi:account-plus"
              }
              width={16}
            />
            {estadoSeguidor?.siguiendo ? "Siguiendo" : "Seguir"}
          </button>
        </div>
        <div className="mt-3">
          <h1 className="text-xl font-bold">{usuario?.nombre}</h1>
          <div className="flex gap-4 mt-1 text-sm text-gray-500">
            <span>
              <strong className="text-black dark:text-white">
                {conteo?.seguidores ?? 0}
              </strong>{" "}
              seguidores
            </span>
            <span>
              <strong className="text-black dark:text-white">
                {conteo?.siguiendo ?? 0}
              </strong>{" "}
              siguiendo
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const PerfilPublicoStats = ({ posts }) => {
  const totalPosts = posts?.length ?? 0;
  const totalLikes =
    posts?.reduce((acc, post) => acc + (post?.likes || 0), 0) ?? 0;
  return (
    <div className="flex border-b border-gray-200 dark:border-gray-600">
      <div className="flex-1 py-3 text-center">
        <span className="block text-lg font-bold">{totalPosts}</span>
        <span className="text-xs text-gray-500">Publicaciones</span>
      </div>
      <div className="flex-1 py-3 text-center border-l border-gray-200 dark:border-gray-600">
        <span className="block text-lg font-bold">{totalLikes}</span>
        <span className="text-xs text-gray-500">Me gusta recibidos</span>
      </div>
    </div>
  );
};

export const PerfilPublicoPage = () => {
  const { id } = useParams();
  const { showModal } = useComentariosStore();
  const scrollRef = useRef(null);
  const { data: usuario, isLoading: loading } = useObtenerUsuarioPorIdQuery(
    Number(id),
  );

  const {
    data: dataPost,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isLoadingPosts,
  } = useMostrarPostPublicoQuery(Number(id));

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const handleScroll = () => {
      if (
        el.scrollTop + el.clientHeight >= el.scrollHeight - 200 &&
        hasNextPage &&
        !isFetchingNextPage
      ) {
        fetchNextPage();
      }
    };
    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const posts = dataPost?.pages?.flatMap((p) => p) ?? [];

  if (loading) return <SpinnerLocal />;

  return (
    <main className="flex flex-col h-screen overflow-hidden">
      {showModal && <ComentarioModal />}
      <div
        ref={scrollRef}
        className="overflow-y-auto h-full border-x border-gray-200 dark:border-gray-600"
      >
        <PerfilPublicoHeader usuario={usuario} id={id} />
        <PerfilPublicoStats posts={posts} />
        <div>
          {isLoadingPosts ? (
            <SpinnerLocal />
          ) : posts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <Icon icon="mdi:post-outline" className="text-5xl mb-3" />
              <p className="text-sm">Este usuario no tiene publicaciones</p>
            </div>
          ) : (
            posts.map((item) => <PublicacionCard key={item.id} item={item} />)
          )}
          {isFetchingNextPage && <SpinnerLocal />}
        </div>
      </div>
    </main>
  );
};
