import { useUsuariosStore } from "../store/UsuariosStore";
import { useMostrarPostPublicoQuery } from "../stack/PostStack";
import { PublicacionCard } from "../components/HomePageComponents/PublicacionCard";
import { FormActualizarPerfil } from "../components/Forms/FormActualizarPerfil";
import { SpinnerLocal } from "../components/ui/spinners/SpinnerLocal";
import { Icon } from "@iconify/react";
import { useRef, useState, useEffect } from "react";
import { useImageExtractColor } from "../hooks/useImageExtractColor";
import { ComentarioModal } from "../components/HomePageComponents/ComentarioModal";
import { useComentariosStore } from "../store/ComentariosStore";

const ProfileHeader = ({ usuario, onEditClick }) => {
  const imgRef = useRef(null);
  const bgColor = useImageExtractColor(imgRef, usuario?.foto_perfil);

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
            onClick={onEditClick}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-300 dark:border-gray-600 text-sm font-semibold hover:bg-gray-100 dark:hover:bg-primary/10 transition-all cursor-pointer"
          >
            <Icon icon="mdi:pencil-outline" width={16} />
            <span>Editar perfil</span>
          </button>
        </div>
        <div className="mt-3">
          <h1 className="text-xl font-bold">{usuario?.nombre}</h1>
          <p className="text-gray-500 text-sm">
            {usuario?.correo_usuario || ""}
          </p>
        </div>
      </div>
    </div>
  );
};

const ProfileStats = ({ posts }) => {
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

export const MiPerfilPage = () => {
  const { dataUsuarioAuth } = useUsuariosStore();
  const { showModal } = useComentariosStore();
  const [showEditForm, setShowEditForm] = useState(false);

  const {
    data: dataPost,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useMostrarPostPublicoQuery(dataUsuarioAuth?.id);

  const scrollRef = useRef(null);

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

  const misPost = dataPost?.pages?.flatMap((p) => p) ?? [];

  return (
    <main className="flex flex-col h-screen overflow-hidden">
      {showEditForm && (
        <FormActualizarPerfil onClose={() => setShowEditForm(false)} />
      )}
      {showModal && <ComentarioModal />}

      <div
        ref={scrollRef}
        className="overflow-y-auto h-full border-x border-gray-200 dark:border-gray-600"
      >
        <ProfileHeader
          usuario={dataUsuarioAuth}
          onEditClick={() => setShowEditForm(true)}
        />

        <ProfileStats posts={misPost} />

        <div>
          {isLoading ? (
            <SpinnerLocal />
          ) : misPost.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <Icon icon="mdi:post-outline" className="text-5xl mb-3" />
              <p className="text-sm">Aún no tienes publicaciones</p>
            </div>
          ) : (
            misPost.map((item) => (
              <PublicacionCard key={item.id} item={item} />
            ))
          )}
          {isFetchingNextPage && <SpinnerLocal />}
        </div>
      </div>
    </main>
  );
};