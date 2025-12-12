import { Icon } from "@iconify/react";
import { BtnClose } from "../ui/buttons/BtnClose";
import {
  useInsertarComentarioMutate,
  useMostrarComentariosQuery,
} from "../../stack/ComentariosStack";
import { useEffect, useRef, useState } from "react";
import EmojiPicker from "emoji-picker-react";
import { useComentariosStore } from "../../store/ComentariosStore";
import { useUsuariosStore } from "../../store/UsuariosStore";
import { usePostStore } from "../../store/PostStore";
import { SpinnerLocal } from "../ui/spinners/SpinnerLocal";
import { ComentarioCard } from "./ComentarioCard";

export const ComentarioModal = () => {
  const [comentario, setComentario] = useState("");
  const { itemSelect: item } = usePostStore();
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const pickerRef = useRef(null);
  const textComentarioRef = useRef(null);
  const { setShowModal } = useComentariosStore();
  const { data: dataComentarios, isLoading: isLoadingComentarios } =
    useMostrarComentariosQuery();
  const { dataUsuarioAuth } = useUsuariosStore();
  const { mutate: comentarioMutate } = useInsertarComentarioMutate({
    comentario: comentario,
    setComentario: setComentario,
  });
  const addEmoji = (emojiData) => {
    const emojiChar = emojiData.emoji;
    const textarea = textComentarioRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const originalText = textarea.value;
    const newText =
      originalText.substring(0, start) +
      emojiChar +
      originalText.substring(end);
    setShowEmojiPicker(false);
    setComentario(newText);
  };
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  return (
    <main className="fixed inset-0 z-100 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <section className="bg-white dark:bg-neutral-900 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-xl flex flex-col relative">
        <header className="h-25 sticky p-4 border-b border-gray-400/20">
          <div className="flex items-center gap-3 text-black dark:text-white">
            <img
              className="w-12 h-12 rounded-full object-cover"
              src={item?.foto_usuario}
            />
            <div className="flex items-center gap-2">
              <span className="font-bold lg:max-w-none lg:overflow-visible md:text-ellipsis max-w-[200px] truncate whitespace-nowrap overflow-hidden">
                {item?.nombre_usuario}
              </span>
            </div>
          </div>
          <span>{item?.descripcion}</span>
          <BtnClose funcion={setShowModal} />
        </header>
        <section className="p-4 overflow-y-auto flex-1">
          {isLoadingComentarios ? (
            <SpinnerLocal />
          ) : (
            dataComentarios?.length > 0 &&
            dataComentarios.map((item, index) => {
              return <ComentarioCard item={item} key={index} />;
            })
          )}
        </section>
        <footer className="flex items-center gap-2 p-4 bg-white dark:bg-neutral-900">
          <section className="w-full gap-2 flex flex-col">
            <section className="flex w-full gap-4">
              <img
                className="w-10 h-10 rounded-full object-cover"
                src={dataUsuarioAuth?.foto_perfil}
                alt="avatar"
              />
              <input
                ref={textComentarioRef}
                placeholder="Escribe un comentario..."
                value={comentario}
                onChange={(e) => setComentario(e.target.value)}
                className="flex-1 bg-gray-100 dark:bg-neutral-800 text-sm rounded-2xl px-4 py-2 focus:outline-none resize-none"
              />
              {showEmojiPicker && (
                <div className="absolute top-10 left-10 mt-2" ref={pickerRef}>
                  <EmojiPicker
                    onEmojiClick={addEmoji}
                    theme="auto"
                    searchDisabled
                  />
                </div>
              )}
              <button
                className="text-gray-500 hover:text-gray-700 relative cursor-pointer"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              >
                <Icon icon="mdi:emoticon-outline" className="text-xl" />
              </button>
            </section>
            <section className="flex justify-end">
              <button
                className={`flex justify-end gap-1 px-4 py-2 rounded-full text-sm text-gray-500 ${
                  comentario.trim() === ""
                    ? "cursor-not-allowed text-gray-500"
                    : "cursor-pointer text-[#00AEF0] hover:bg-blue-600/10"
                }`}
                onClick={comentarioMutate}
              >
                <Icon icon="iconamoon:send-fill" width="20" height="20" />
                Comentar
              </button>
            </section>
          </section>
        </footer>
      </section>
    </main>
  );
};
