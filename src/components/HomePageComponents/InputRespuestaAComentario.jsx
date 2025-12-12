import { useUsuariosStore } from "../../store/UsuariosStore";
import { useEffect, useRef, useState } from "react";
import EmojiPicker from "emoji-picker-react";
import { useInsertarRespuestaComentarioMutate } from "../../stack/RespuestasComentariosStack";
import { Icon } from "@iconify/react";
import { useRespuestasComentariosStore } from "../../store/RespuestasComentariosStore";

export const InputRespuestaAComentario = () => {
  const [comentario, setComentario] = useState("");
  const { setRespuesta } = useRespuestasComentariosStore();
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const pickerRef = useRef(null);
  const textComentarioRef = useRef(null);
  const { dataUsuarioAuth } = useUsuariosStore();
  const { mutate: comentarioMutate } = useInsertarRespuestaComentarioMutate();
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
    setRespuesta(newText);
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
    <section className="flex items-center gap-2 p-4 bg-white dark:bg-neutral-900">
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
            onChange={(e) => {
              setRespuesta(e.target.value);
              setComentario(e.target.value);
            }}
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
            className={`flex justify-end gap-1 px-4 py-2 rounded-full text-sm text-gray-500 cursor-not-allowed ${
              comentario.trim() === ""
                ? "cursor-not-allowed text-gray-500"
                : "cursor-pointer text-[#00AEF0] hover:bg-blue-600/10"
            }`}
            onClick={comentarioMutate}
          >
            <Icon icon="iconamoon:send-fill" width="20" height="20" />
            Responder
          </button>
        </section>
      </section>
    </section>
  );
};
