import { BtnClose } from "../ui/buttons/BtnClose";
import { useUsuariosStore } from "../../store/UsuariosStore";
import { useRef, useState } from "react";
import { Icon } from "@iconify/react";
import { ImageSelector } from "../../hooks/useImageSelector";
import { usePostStore } from "../../store/PostStore";
import { useInsertarPostMutate } from "../../stack/PostStack";
import { useForm } from "react-hook-form";
import { EmojiPickerSimple } from "../ui/EmojiPickerSimple";

export const FormPost = () => {
  const { dataUsuarioAuth } = useUsuariosStore();
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const textareaRef = useRef(null);
  const [postText, setPostText] = useState("");
  const { stateImage, setStateImage, setStateForm, file } = usePostStore();
  const { mutate, isPending } = useInsertarPostMutate();
  const { handleSubmit, setValue } = useForm();
  const MAX_CARACTERES = 500;
  const puedePublicar = postText.trim().length > 0 || file !== null;

  const addEmoji = (emoji) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newText =
      postText.substring(0, start) + emoji + postText.substring(end);
    if (newText.length > MAX_CARACTERES) return;
    setPostText(newText);
    setValue("descripcion", newText);
  };

  const handleTextchange = (e) => {
    const value = e.target.value.slice(0, MAX_CARACTERES);
    setPostText(value);
    setValue("descripcion", value);
  };

  return (
    <section className="fixed z-50 flex items-center justify-center inset-0">
      <div
        className="absolute inset-0 backdrop-blur-sm cursor-pointer"
        onClick={() => setStateForm(false)}
      />
      <section className="bg-white dark:bg-bg-dark text-black dark:text-white relative w-full max-w-md rounded-lg shadow-xl">
        <header className="flex items-center justify-between p-4 border-b border-gray-500/40">
          <h2 className="text-xl font-semibold">Crear Publicación</h2>
          <BtnClose funcion={() => setStateForm(false)} />
        </header>
        <main className="p-4 space-y-4">
          <section className="flex items-center gap-1">
            <img
              className="w-10 h-10 rounded-full mr-3 object-cover"
              src={dataUsuarioAuth?.foto_perfil || "https://placehold.co/40x40"}
              onError={(e) => (e.target.src = "https://placehold.co/40x40")}
            />
            <span className="font-medium">{dataUsuarioAuth?.nombre}</span>
          </section>
          <form
            onSubmit={handleSubmit(() => mutate({ descripcion: postText }))}
          >
            <div className="relative">
              <textarea
                ref={textareaRef}
                placeholder="¿Qué estás pensando?"
                value={postText}
                onChange={handleTextchange}
                className="w-full bg-transparent placeholder-gray-500 dark:placeholder-gray-400 outline-none resize-none text-black dark:text-white"
                rows={4}
              />
              {postText.length > 0 && (
                <div className="flex justify-end mt-1">
                  <span
                    className={`text-xs ${
                      postText.length >= MAX_CARACTERES
                        ? "text-red-500 font-semibold"
                        : postText.length > MAX_CARACTERES * 0.8
                        ? "text-yellow-500"
                        : "text-gray-400"
                    }`}
                  >
                    {postText.length}/{MAX_CARACTERES}
                  </span>
                </div>
              )}
              <div className="mt-4 flex items-center justify-between">
                <button
                  disabled={!puedePublicar || isPending}
                  type="submit"
                  className={`py-2 px-4 rounded-lg font-medium text-white ${
                    puedePublicar
                      ? "bg-primary cursor-pointer"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
                >
                  {isPending ? "Publicando..." : "Publicar"}
                </button>
                <div className="relative">
                  {showEmojiPicker && (
                    <EmojiPickerSimple
                      onEmojiClick={addEmoji}
                      onClose={() => setShowEmojiPicker(false)}
                    />
                  )}
                  <button
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    type="button"
                    className="p-1 text-black/50 dark:text-white/50 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full cursor-pointer"
                  >
                    <Icon icon="mdi:emoticon-outline" className="text-2xl" />
                  </button>
                </div>
              </div>
            </div>
          </form>
          {stateImage && <ImageSelector />}
        </main>
        <footer className="p-4 border-t border-gray-500/40">
          <div className="flex items-center justify-between p-3 border border-gray-500/40">
            <span className="text-sm">Agregar a tu Publicación</span>
            <div className="flex space-x-4">
              <button
                onClick={setStateImage}
                className="p-1 rounded-full text-black/50 dark:text-white/50 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer"
                aria-label="Agregar imagen"
              >
                <Icon icon="mdi:image" className="text-2xl" />
              </button>
            </div>
          </div>
        </footer>
      </section>
    </section>
  );
};
