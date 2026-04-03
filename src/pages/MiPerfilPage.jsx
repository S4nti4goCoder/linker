import { useUsuariosStore } from "../store/UsuariosStore";
import {
  useMostrarPostPublicoQuery,
  useMostrarPostsLikedQuery,
} from "../stack/PostStack";
import { PublicacionCard } from "../components/HomePageComponents/PublicacionCard";
import { FormActualizarPerfil } from "../components/Forms/FormActualizarPerfil";
import { SpinnerLocal } from "../components/ui/spinners/SpinnerLocal";
import { SkeletonPost } from "../components/ui/spinners/SkeletonPost";
import { Icon } from "@iconify/react";
import { useRef, useState, useEffect } from "react";
import { useImageExtractColor } from "../hooks/useImageExtractColor";
import { ComentarioModal } from "../components/HomePageComponents/ComentarioModal";
import { useComentariosStore } from "../store/ComentariosStore";
import { useConteoSeguidoresQuery } from "../stack/UsuariosStack";
import { isValidUrl, isValidUsername } from "../utils/validation";

const ProfileHeader = ({ usuario, onEditClick }) => {
  const imgRef = useRef(null);
  const bgColor = useImageExtractColor(imgRef, usuario?.foto_perfil);
  const { data: conteo } = useConteoSeguidoresQuery(usuario?.id);
  const tieneBanner = usuario?.banner && usuario.banner !== "-";

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
      <div className="px-4 pb-4 border-b border-gray-200 dark:border-gray-600 relative z-10">
        <div className="flex justify-between items-end -mt-12">
          <img
            ref={imgRef}
            src={usuario?.foto_perfil || "https://placehold.co/96x96"}
            onError={(e) => (e.target.src = "https://placehold.co/96x96")}
            crossOrigin="anonymous"
            className="w-24 h-24 rounded-full object-cover border-4 border-white dark:border-neutral-900 relative z-10"
          />
          <button
            onClick={onEditClick}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-300 dark:border-gray-600 text-sm font-semibold hover:bg-gray-100 dark:hover:bg-primary/10 transition-all cursor-pointer"
          >
            <Icon icon="mdi:pencil-outline" width={16} />
            <span>Editar perfil</span>
          </button>
        </div>

        <div className="mt-3 space-y-2">
          <h1 className="text-xl font-bold">{usuario?.nombre}</h1>

          {usuario?.bio && (
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {usuario.bio}
            </p>
          )}

          <div className="flex flex-wrap gap-3">
            {usuario?.instagram && isValidUsername(usuario.instagram) && (
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
            {usuario?.twitter && isValidUsername(usuario.twitter) && (
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
            {usuario?.website && isValidUrl(usuario.website) && (
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

const MiPerfilPage = () => {
  const { dataUsuarioAuth } = useUsuariosStore();
  const { showModal } = useComentariosStore();
  const [showEditForm, setShowEditForm] = useState(false);
  const [tab, setTab] = useState("posts");

  const {
    data: dataPost,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useMostrarPostPublicoQuery(dataUsuarioAuth?.id);

  const { data: likedPosts = [], isLoading: isLoadingLiked } =
    useMostrarPostsLikedQuery(dataUsuarioAuth?.id);

  const scrollRef = useRef(null);
  const sentinelRef = useRef(null);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage && tab === "posts")
          fetchNextPage();
      },
      { root: scrollRef.current, rootMargin: "200px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage, tab]);

  const misPost = dataPost?.pages?.flatMap((p) => p) ?? [];

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {showEditForm && (
        <FormActualizarPerfil onClose={() => setShowEditForm(false)} />
      )}
      {showModal && <ComentarioModal />}

      <div
        ref={scrollRef}
        className="overflow-y-auto h-full"
      >
        <ProfileHeader
          usuario={dataUsuarioAuth}
          onEditClick={() => setShowEditForm(true)}
        />

        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-600 sticky top-0 z-10 bg-white dark:bg-bg-dark">
          <button
            onClick={() => setTab("posts")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold transition-colors cursor-pointer ${
              tab === "posts"
                ? "text-primary border-b-2 border-primary"
                : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            }`}
          >
            <Icon icon="mdi:grid" width={18} />
            Publicaciones
          </button>
          <button
            onClick={() => setTab("likes")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold transition-colors cursor-pointer ${
              tab === "likes"
                ? "text-primary border-b-2 border-primary"
                : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            }`}
          >
            <Icon icon="mdi:heart-outline" width={18} />
            Me gusta
          </button>
        </div>

        {/* Tab: Publicaciones */}
        {tab === "posts" && (
          <div>
            {isLoading ? (
              <>
                <SkeletonPost />
                <SkeletonPost />
              </>
            ) : misPost.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                <Icon icon="mdi:post-outline" className="text-5xl mb-3" />
                <p className="text-sm">Aún no tienes publicaciones</p>
              </div>
            ) : (
              misPost.map((item) => <PublicacionCard key={item.id} item={item} />)
            )}
            {isFetchingNextPage && <SpinnerLocal />}
            <div ref={sentinelRef} className="h-1" />
          </div>
        )}

        {/* Tab: Me gusta */}
        {tab === "likes" && (
          <div>
            {isLoadingLiked ? (
              <>
                <SkeletonPost />
                <SkeletonPost />
              </>
            ) : likedPosts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                <Icon icon="mdi:heart-outline" className="text-5xl mb-3" />
                <p className="text-sm">Aún no te ha gustado ninguna publicación</p>
              </div>
            ) : (
              likedPosts.map((item) => <PublicacionCard key={item.id} item={item} />)
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MiPerfilPage;
