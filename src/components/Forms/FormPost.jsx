import { BtnClose } from "../ui/buttons/BtnClose";
import { useUsuariosStore } from "../../store/UsuariosStore";
import { useState } from "react";
import EmojiPicker from "emoji-picker-react";

export const FormPost = () => {
  const { dataUsuarioAuth } = useUsuariosStore();
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  return (
    <section className="fixed z-50 flex items-center justify-center inset-0">
      <div className="absolute inset-0 backdrop-blur-sm cursor-pointer"></div>
      <section className="bg-white relative w-full max-w-md dark:bg-bg-dark rounded-lg shadow-xl">
        <header className="flex items-center justify-between p-4 border-b border-gray-500/40">
          <h2 className="text-xl font-semibold">Crear Publicación</h2>
          <BtnClose />
        </header>
        <main className="p-4 space-y-4">
          <section className="flex items-center gap-1">
            <img
              className="w-10 h-10 rounded-full mr-3 object-cover"
              src={dataUsuarioAuth?.foto_perfil}
            />
            <div>
              <span className="font-medium">{dataUsuarioAuth?.nombre}</span>
            </div>
          </section>
          <form>
            <div className="relative">
              <textarea
                placeholder="¿Qué estás pensando?"
                className="w-full placeholder-gray-500 outline-none"
              />
              {showEmojiPicker && (
                <div>
                  <EmojiPicker />
                </div>
              )}
            </div>
          </form>
        </main>
        <footer></footer>
      </section>
    </section>
  );
};
