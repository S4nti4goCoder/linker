import { Icon } from "@iconify/react";
import { BtnClose } from "../ui/buttons/BtnClose";
import {
  useInsertarComentarioMutate,
  useMostrarComentariosQuery,
} from "../../stack/ComentariosStack";
import { useRef, useState } from "react";
import { useComentariosStore } from "../../store/ComentariosStore";
import { useUsuariosStore } from "../../store/UsuariosStore";
import { usePostStore } from "../../store/PostStore";
import { SpinnerLocal } from "../ui/spinners/SpinnerLocal";
import { ComentarioCard } from "./ComentarioCard";
import { EmojiPickerSimple } from "../ui/EmojiPickerSimple";

export const ComentarioModal = () => {
  const [comentario, setComentario] = useState("");
  const { itemSelect: item } = usePostStore();
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const textComentarioRef = useRef(null);
  const { setShowModal } = useComentariosStore();
  const { data: dataComentarios, isLoading: isLoadingComentarios } =
    useMostrarComentariosQuery();
  const { dataUsuarioAuth } = useUsuariosStore();
  const { mutate: comentarioMutate } = useInsertarComentarioMutate({
    setComentario,
  });

  const addEmoji = (emoji) => {
    const textarea = textComentarioRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newText =
      comentario.substring(0, start) + emoji + comentario.substring(end);
    setComentario(newText);
  };

  return (
    <main
      role="dialog"
      aria-modal="true"
      aria-label="Comentarios"
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center"
      onClick={(e) => e.target === e.currentTarget && setShowModal()}
    >
      <section className="bg-white dark:bg-neutral-900 rounded-t-2xl sm:rounded-xl w-full sm:max-w-2xl max-h-[90vh] shadow-xl flex flex-col">
        <header className="shrink-0 p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="relative flex items-center justify-center mb-3">
            <span className="font-bold text-base">Comentarios</span>
            <div className="absolute right-0">
              <BtnClose funcion={setShowModal} />
            </div>
          </div>
          <div className="flex items-start gap-3">
            <img
              className="w-10 h-10 rounded-full object-cover shrink-0"
              src={item?.foto_usuario || "https://placehold.co/40x40"}
              onError={(e) => (e.target.src = "https://placehold.co/40x40")}
              alt={`Foto de ${item?.nombre_usuario}`}
            />
            <div className="flex-1 min-w-0">
              <span className="font-semibold text-sm block truncate">
                {item?.nombre_usuario}
              </span>
              <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                {item?.descripcion}
              </p>
            </div>
          </div>
        </header>

        <section className="flex-1 overflow-y-auto p-4 space-y-2">
          {isLoadingComentarios ? (
            <SpinnerLocal />
          ) : dataComentarios?.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-gray-400">
              <Icon icon="mdi:comment-outline" className="text-4xl mb-2" />
              <p className="text-sm">Sé el primero en comentar</p>
            </div>
          ) : (
            dataComentarios?.map((item) => (
              <ComentarioCard item={item} key={item.id} />
            ))
          )}
        </section>

        <footer className="shrink-0 border-t border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-neutral-900">
          <div className="flex items-center gap-3">
            <img
              className="w-9 h-9 rounded-full object-cover shrink-0"
              src={dataUsuarioAuth?.foto_perfil || "https://placehold.co/36x36"}
              onError={(e) => (e.target.src = "https://placehold.co/36x36")}
              alt="avatar"
            />
            <div className="flex-1 flex items-center gap-2 bg-gray-100 dark:bg-neutral-800 rounded-full px-4 py-2">
              <input
                ref={textComentarioRef}
                placeholder="Escribe un comentario..."
                value={comentario}
                onChange={(e) => setComentario(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && comentario.trim() !== "") {
                    comentarioMutate(comentario);
                  }
                }}
                className="flex-1 bg-transparent text-sm focus:outline-none"
              />
              <div className="relative">
                {showEmojiPicker && (
                  <EmojiPickerSimple
                    onEmojiClick={addEmoji}
                    onClose={() => setShowEmojiPicker(false)}
                  />
                )}
                <button
                  className="text-gray-400 hover:text-gray-600 cursor-pointer"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                >
                  <Icon icon="mdi:emoticon-outline" className="text-xl" />
                </button>
              </div>
            </div>
            <button
              disabled={comentario.trim() === ""}
              onClick={() => comentarioMutate(comentario)}
              className={`p-2 rounded-full transition-all ${
                comentario.trim() === ""
                  ? "text-gray-300 dark:text-gray-600 cursor-not-allowed"
                  : "text-[#00AEF0] hover:bg-blue-600/10 cursor-pointer"
              }`}
            >
              <Icon icon="iconamoon:send-fill" width="22" height="22" />
            </button>
          </div>
        </footer>
      </section>
    </main>
  );
};