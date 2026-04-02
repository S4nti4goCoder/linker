import { useUsuariosStore } from "../../store/UsuariosStore";
import { useRef, useState } from "react";
import { useInsertarRespuestaComentarioMutate } from "../../stack/RespuestasComentariosStack";
import { Icon } from "@iconify/react";
import { useRespuestasComentariosStore } from "../../store/RespuestasComentariosStore";
import { EmojiPickerSimple } from "../ui/EmojiPickerSimple";

export const InputRespuestaAComentario = () => {
  const [comentario, setComentario] = useState("");
  const { respuestaActivaParaComentarioId } = useRespuestasComentariosStore();
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const textComentarioRef = useRef(null);
  const { dataUsuarioAuth } = useUsuariosStore();
  const { mutate: comentarioMutate } = useInsertarRespuestaComentarioMutate();

  const enviarRespuesta = () => {
    if (comentario.trim() === "" || !respuestaActivaParaComentarioId) return;
    comentarioMutate({
      id_comentario: respuestaActivaParaComentarioId,
      comentario,
    });
    setComentario("");
  };

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
    <section className="flex items-center gap-2 p-4 bg-white dark:bg-neutral-900">
      <section className="w-full gap-2 flex flex-col">
        <section className="flex w-full gap-4">
          <img
            className="w-10 h-10 rounded-full object-cover"
            src={dataUsuarioAuth?.foto_perfil || "https://placehold.co/40x40"}
            onError={(e) => (e.target.src = "https://placehold.co/40x40")}
            alt="avatar"
          />
          <input
            ref={textComentarioRef}
            placeholder="Escribe un comentario..."
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
            className="flex-1 bg-gray-100 dark:bg-neutral-800 text-sm rounded-2xl px-4 py-2 focus:outline-none resize-none"
          />
          <div className="relative">
            {showEmojiPicker && (
              <EmojiPickerSimple
                onEmojiClick={addEmoji}
                onClose={() => setShowEmojiPicker(false)}
              />
            )}
            <button
              className="text-gray-500 hover:text-gray-700 cursor-pointer"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            >
              <Icon icon="mdi:emoticon-outline" className="text-xl" />
            </button>
          </div>
        </section>
        <section className="flex justify-end">
          <button
            className={`flex justify-end gap-1 px-4 py-2 rounded-full text-sm ${
              comentario.trim() === ""
                ? "cursor-not-allowed text-gray-500"
                : "cursor-pointer text-[#00AEF0] hover:bg-blue-600/10"
            }`}
            onClick={enviarRespuesta}
          >
            <Icon icon="iconamoon:send-fill" width="20" height="20" />
            Responder
          </button>
        </section>
      </section>
    </section>
  );
};
