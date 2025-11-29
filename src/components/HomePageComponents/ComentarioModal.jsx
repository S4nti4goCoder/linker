import { Icon } from "@iconify/react";
import { BtnClose } from "../ui/buttons/BtnClose";
import { useInsertarComentarioMutate } from "../../stack/ComentariosStack";
import { useEffect, useRef, useState } from "react";
import EmojiPicker from "emoji-picker-react";
import { useComentariosStore } from "../../store/ComentariosStore";

export const ComentarioModal = ({ item, onClose }) => {
  const [comentario, setComentario] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const pickerRef = useRef(null);
  const textComentarioRef = useRef(null);
  const { setShowModal } = useComentariosStore();
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
      <section className="dark:bg-neutral-900 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-xl flex flex-col relative">
        <header className="h-25 sticky p-4 border-b border-gray-400/20">
          <div className="flex items-center gap-3 text-black dark:text-white">
            <img
              className="w-12 h-12 rounded-full object-cover"
              src="https://images.unsplash.com/photo-1761839256601-e768233e25e7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDF8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxfHx8ZW58MHx8fHx8"
            />
            <div className="flex items-center gap-2">
              <span className="font-bold lg:max-w-none lg:overflow-visible md:text-ellipsis max-w-[200px] truncate whitespace-nowrap overflow-hidden">
                Nombre usuario
              </span>
            </div>
          </div>
          <span>Descripción</span>
          <BtnClose funcion={setShowModal} />
        </header>
        <section className="p-4 overflow-y-auto flex-1">
          <p>Sin Comentarios</p>
        </section>
        <footer className="flex items-center gap-2 p-4 bg-white dark:bg-neutral-900">
          <section className="w-full gap-2 flex flex-col">
            <section className="flex w-full gap-4">
              <img
                className="w-10 h-10 rounded-full object-cover"
                src="https://images.unsplash.com/photo-1761839256601-e768233e25e7?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDF8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxfHx8ZW58MHx8fHx8"
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
                className="flex justify-end gap-1 px-4 py-2 rounded-full text-sm text-gray-500 cursor-not-allowed"
                onClick={comentarioMutate}
              >
                <Icon icon="iconamoon:send-fill" width="20" height="20" />
                Publicar
              </button>
            </section>
          </section>
        </footer>
      </section>
    </main>
  );
};
