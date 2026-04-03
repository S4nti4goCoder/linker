import { Icon } from "@iconify/react";
import { PostImageFrame } from "./PostImageFrame";
import { PostVideoFrame } from "./PostVideoFrame";
import { usePostStore } from "../../store/PostStore";
import {
  useLikePostMutate,
  useEliminarPostMutate,
  useEditarPostMutate,
} from "../../stack/PostStack";
import { useComentariosStore } from "../../store/ComentariosStore";
import { getRelativeTime } from "../../hooks/useRelativeTime";
import { useUsuariosStore } from "../../store/UsuariosStore";
import { useState, useEffect, useRef, memo } from "react";
import { EmojiPickerSimple } from "../ui/EmojiPickerSimple";
import { ImageSelectorEdit } from "../../hooks/useImageSelector";
import { useNavigate } from "react-router-dom";
import { useToggleSeguirMutate } from "../../stack/UsuariosStack";
import { useToggleGuardadoMutate } from "../../stack/ColeccionesStack";

export const PublicacionCard = memo(({ item }) => {
  const { setItemSelect } = usePostStore();
  const { mutate } = useLikePostMutate();
  const { setShowModal } = useComentariosStore();
  const { dataUsuarioAuth } = useUsuariosStore();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [editText, setEditText] = useState("");
  const [editFile, setEditFile] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showImageSelector, setShowImageSelector] = useState(false);
  const textareaRef = useRef(null);

  const esPropio = Number(item?.id_usuario) === Number(dataUsuarioAuth?.id);

  const { mutate: eliminar, isPending: isEliminating } = useEliminarPostMutate(
    () => setShowConfirm(false),
  );
  const { mutate: editar, isPending: isEditing } = useEditarPostMutate(() =>
    setShowEditForm(false),
  );
  const { mutate: toggleSeguir, isPending: isSiguiendo } =
    useToggleSeguirMutate(item?.id_usuario);
  const { mutate: toggleGuardado } = useToggleGuardadoMutate(item?.id);

  useEffect(() => {
    if (showEditForm) {
      setEditText(item?.descripcion || "");
      setShowImageSelector(false);
      setShowEmojiPicker(false);
      setEditFile(null);
    }
  }, [showEditForm, item?.descripcion]);

  const addEmoji = (emoji) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newText =
      editText.substring(0, start) + emoji + editText.substring(end);
    setEditText(newText);
  };

  const irAlPerfil = () => {
    if (esPropio) {
      navigate("/mi-perfil");
    } else {
      navigate(`/perfil/${item?.id_usuario}`);
    }
  };

  return (
    <div className="border-b border-gray-500/50 p-4 relative">
      <div className="flex justify-between">
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={irAlPerfil}
        >
          <img
            src={item?.foto_usuario || "https://placehold.co/48x48"}
            onError={(e) => (e.target.src = "https://placehold.co/48x48")}
            alt={`Foto de ${item?.nombre_usuario}`}
            className="w-12 h-12 rounded-full object-cover hover:opacity-90 transition-opacity"
          />
          <span className="font-bold hover:underline">
            {item?.nombre_usuario}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {!esPropio && (
            <button
              onClick={() => toggleSeguir()}
              disabled={isSiguiendo}
              className={`group text-xs font-semibold px-3 py-1 rounded-full border transition-all cursor-pointer disabled:opacity-50 ${
                item?.siguiendo_autor
                  ? "border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:border-red-400 hover:text-red-400"
                  : "border-primary text-primary hover:bg-primary hover:text-white"
              }`}
            >
              {item?.siguiendo_autor ? (
                <>
                  <span className="group-hover:hidden">Siguiendo</span>
                  <span className="hidden group-hover:inline">Dejar de seguir</span>
                </>
              ) : "+ Seguir"}
            </button>
          )}
          <span className="text-gray-500 text-sm whitespace-nowrap">
            {getRelativeTime(item?.fecha)}
          </span>
          {esPropio && (
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                aria-label="Opciones de publicación"
                className="cursor-pointer p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                <Icon icon="mdi:dots-horizontal" className="text-gray-500" />
              </button>
              {showMenu && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowMenu(false)}
                  />
                  <div className="absolute right-0 top-8 z-20 bg-white dark:bg-neutral-800 rounded-xl shadow-xl border border-gray-200 dark:border-neutral-700 overflow-hidden w-40">
                    <button
                      onClick={() => {
                        setShowEditForm(true);
                        setShowMenu(false);
                      }}
                      className="flex items-center gap-2 w-full px-4 py-3 text-sm hover:bg-gray-100 dark:hover:bg-neutral-700 cursor-pointer"
                    >
                      <Icon
                        icon="mdi:pencil-outline"
                        className="text-blue-500"
                      />
                      Editar
                    </button>
                    <button
                      onClick={() => {
                        setShowConfirm(true);
                        setShowMenu(false);
                      }}
                      className="flex items-center gap-2 w-full px-4 py-3 text-sm hover:bg-gray-100 dark:hover:bg-neutral-700 cursor-pointer text-red-500"
                    >
                      <Icon
                        icon="mdi:trash-can-outline"
                        className="text-red-500"
                      />
                      Eliminar
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modal confirmar eliminar */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Confirmar eliminación">
          <div className="bg-white dark:bg-neutral-900 rounded-xl w-full max-w-sm p-6">
            <div className="flex flex-col items-center text-center gap-3">
              <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-500/20 flex items-center justify-center">
                <Icon
                  icon="mdi:trash-can-outline"
                  className="text-2xl text-red-500"
                />
              </div>
              <h2 className="text-lg font-bold">¿Eliminar publicación?</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Esta acción no se puede deshacer.
              </p>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 px-4 py-2 rounded-lg text-sm border border-gray-300 dark:border-neutral-700 hover:bg-gray-100 dark:hover:bg-neutral-800 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={() => eliminar(item?.id)}
                disabled={isEliminating}
                className="flex-1 px-4 py-2 rounded-lg text-sm bg-red-500 text-white hover:bg-red-600 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isEliminating ? "Eliminando..." : "Sí, eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal editar */}
      {showEditForm && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Editar publicación">
          <div className="bg-white dark:bg-neutral-900 text-black dark:text-white rounded-xl w-full max-w-md p-6 relative">
            <button
              onClick={() => setShowEditForm(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              <Icon icon="mdi:close" className="text-xl" />
            </button>
            <h2 className="text-lg font-bold mb-4">Editar publicación</h2>
            <textarea
              ref={textareaRef}
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="w-full bg-gray-100 dark:bg-neutral-800 rounded-lg p-3 text-sm outline-none resize-none"
              rows={4}
            />
            {showImageSelector && (
              <div className="mt-3">
                <ImageSelectorEdit
                  onFileSelect={(file) => setEditFile(file)}
                  onRemove={() => setEditFile(null)}
                />
              </div>
            )}
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-2">
                <div className="relative">
                  {showEmojiPicker && (
                    <EmojiPickerSimple
                      onEmojiClick={addEmoji}
                      onClose={() => setShowEmojiPicker(false)}
                    />
                  )}
                  <button
                    type="button"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-full cursor-pointer"
                  >
                    <Icon icon="mdi:emoticon-outline" className="text-xl" />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => setShowImageSelector(!showImageSelector)}
                  className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-full cursor-pointer"
                >
                  <Icon icon="mdi:image-outline" className="text-xl" />
                </button>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowEditForm(false)}
                  className="px-4 py-2 rounded-lg text-sm text-gray-500 hover:bg-gray-100 dark:hover:bg-neutral-800 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  onClick={() =>
                    editar({
                      descripcion: editText,
                      id: item?.id,
                      file: editFile,
                    })
                  }
                  disabled={editText.trim() === "" || isEditing}
                  className="px-4 py-2 rounded-lg text-sm bg-primary text-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isEditing ? "Guardando..." : "Guardar"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-3">
        <p className="mb-2">{item?.descripcion}</p>
        <div>
          {item?.url !== "-" &&
            (item?.type === "imagen" ? (
              <PostImageFrame src={item?.url} />
            ) : (
              <PostVideoFrame src={item?.url} />
            ))}
        </div>

        {/* Acciones: like, comentar, guardar */}
        <div className="flex justify-between mt-4">
          <button onClick={() => mutate(item)} aria-label={item?.like_usuario_actual ? "Quitar me gusta" : "Me gusta"}>
            <Icon
              icon={
                item?.like_usuario_actual ? "mdi:heart" : "mdi:heart-outline"
              }
              className={`text-3xl p-1 rounded-full ${
                item?.like_usuario_actual
                  ? "text-[#0091EA]"
                  : "text-gray-400 hover:bg-[rgba(78,184,233,0.2)]"
              } cursor-pointer`}
            />
          </button>
          <button
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => {
              setItemSelect(item);
              setShowModal();
            }}
          >
            <Icon
              icon="mdi:comment-outline"
              className="text-3xl p-1 rounded-full text-gray-400 cursor-pointer"
            />
            <span className="text-xs md:text-sm text-gray-400">Comentar</span>
          </button>

          <button
            onClick={() => toggleGuardado()}
            title={item?.guardado ? "Quitar de guardados" : "Guardar publicación"}
            className="cursor-pointer"
          >
            <Icon
              icon={item?.guardado ? "mdi:bookmark" : "mdi:bookmark-outline"}
              className={`text-3xl p-1 rounded-full transition-colors ${
                item?.guardado ? "text-primary" : "text-gray-400 hover:bg-primary/10"
              }`}
            />
          </button>
        </div>

        <div className="flex gap-4 mt-1">
          {item?.likes > 0 && (
            <span className="text-xs text-gray-400">
              {item?.likes} me gusta
            </span>
          )}
          {item?.comentarios_count > 0 && (
            <span
              onClick={() => {
                setItemSelect(item);
                setShowModal();
              }}
              className="text-xs text-gray-400 cursor-pointer hover:underline"
            >
              {item?.comentarios_count} {item?.comentarios_count === 1 ? "comentario" : "comentarios"}
            </span>
          )}
        </div>
      </div>
    </div>
  );
});
