import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
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
import { useAbrirConversacionMutate } from "../stack/MensajesStack";

const PerfilPublicoHeader = ({ usuario, id }) => {
  const navigate = useNavigate();
  const imgRef = useRef(null);
  const bgColor = useImageExtractColor(imgRef, usuario?.foto_perfil);
  const { mutate: toggleSeguir, isPending: isSiguiendo } =
    useToggleSeguirMutate(Number(id));
  const { data: estadoSeguidor } = useEstadoSeguidorQuery(Number(id));
  const { data: conteo } = useConteoSeguidoresQuery(Number(id));
  const { mutate: abrirConversacion, isPending: abriendo } =
    useAbrirConversacionMutate();

  const tieneBanner = usuario?.banner && usuario.banner !== "-";
  const yoLoSigo = estadoSeguidor?.siguiendo;

  const handleMensaje = () => {
    abrirConversacion(Number(id), {
      onSuccess: () => navigate("/mensajes"),
    });
  };

  return (
    <div>
      {/* Banner */}
      <div
        className="h-36 w-full transition-colors duration-500 relative overflow-hidden"
        style={!tieneBanner ? { backgroundColor: bgColor || "#0466c8" } : {}}
      >
        {tieneBanner && (
          <img
            src={usuario.banner}
            className="w-full h-full object-cover"
            onError={(e) => (e.target.style.display = "none")}
          />
        )}
      </div>

      {/* Contenido del perfil */}
      <div className="px-4 pb-4 border-b border-gray-200 dark:border-gray-600 bg-white dark:bg-bg-dark relative z-10">
        <div className="flex justify-between items-end -mt-12">
          <img
            ref={imgRef}
            src={usuario?.foto_perfil || "https://placehold.co/96x96"}
            onError={(e) => (e.target.src = "https://placehold.co/96x96")}
            crossOrigin="anonymous"
            className="w-24 h-24 rounded-full object-cover border-4 border-white dark:border-bg-dark relative z-10"
          />
          <div className="flex items-center gap-2">
            {yoLoSigo && (
              <button
                onClick={handleMensaje}
                disabled={abriendo}
                className="flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-800 transition-all cursor-pointer disabled:opacity-50"
              >
                <Icon icon="mdi:message-outline" width={16} />
                <span className="hidden sm:block">Mensaje</span>
              </button>
            )}
            <button
              onClick={() => toggleSeguir()}
              disabled={isSiguiendo}
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
        </div>

        <div className="mt-3 space-y-2">
          <h1 className="text-xl font-bold">{usuario?.nombre}</h1>

          {usuario?.bio && (
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {usuario.bio}
            </p>
          )}

          <div className="flex flex-wrap gap-3">
            {usuario?.instagram && (
              <a
                href={`https://instagram.com/${usuario.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-gray-500 hover:text-pink-500 transition-colors"
              >
                <Icon icon="mdi:instagram" className="text-pink-500" />@
                {usuario.instagram}
              </a>
            )}
            {usuario?.twitter && (
              <a
                href={`https://twitter.com/${usuario.twitter}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-gray-500 hover:text-sky-400 transition-colors"
              >
                <Icon icon="mdi:twitter" className="text-sky-400" />@
                {usuario.twitter}
              </a>
            )}
            {usuario?.website && (
              <a
                href={usuario.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-gray-500 hover:text-blue-400 transition-colors"
              >
                <Icon icon="mdi:web" className="text-blue-400" />
                {usuario.website.replace(/^https?:\/\//, "")}
              </a>
            )}
          </div>

          <div className="flex gap-4 text-sm text-gray-500">
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
