import { useForm } from "react-hook-form";
import { useState } from "react";
import { Icon } from "@iconify/react";
import { useEditarPerfilMutate } from "../../stack/UsuariosStack";
import { useUsuariosStore } from "../../store/UsuariosStore";
import { BtnClose } from "../ui/buttons/BtnClose";

export const FormActualizarPerfil = ({ onClose }) => {
  const { dataUsuarioAuth } = useUsuariosStore();
  const { mutate, isPending } = useEditarPerfilMutate(onClose);

  const [fileFoto, setFileFoto] = useState(null);
  const [fileFotoUrl, setFileFotoUrl] = useState(
    dataUsuarioAuth?.foto_perfil || null,
  );
  const [fileBanner, setFileBanner] = useState(null);
  const [fileBannerUrl, setFileBannerUrl] = useState(
    dataUsuarioAuth?.banner !== "-" ? dataUsuarioAuth?.banner : null,
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      nombre: dataUsuarioAuth?.nombre ?? "",
      bio: dataUsuarioAuth?.bio ?? "",
      instagram: dataUsuarioAuth?.instagram ?? "",
      twitter: dataUsuarioAuth?.twitter ?? "",
      website: dataUsuarioAuth?.website ?? "",
    },
  });

  const handleFotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileFoto(file);
    setFileFotoUrl(URL.createObjectURL(file));
  };

  const handleBannerChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileBanner(file);
    setFileBannerUrl(URL.createObjectURL(file));
  };

  const onSubmit = (data) => {
    mutate({ ...data, fileFoto, fileBanner });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl w-full max-w-lg relative overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-5 py-4 border-b border-gray-200 dark:border-neutral-700 sticky top-0 bg-white dark:bg-neutral-900 z-10">
          <h1 className="text-lg font-bold">Editar perfil</h1>
          <BtnClose funcion={onClose} />
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Banner */}
          <div className="relative h-32 bg-gray-200 dark:bg-neutral-800 group cursor-pointer">
            {fileBannerUrl ? (
              <img src={fileBannerUrl} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <Icon icon="mdi:image-outline" className="text-4xl" />
              </div>
            )}
            <label className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
              <div className="flex items-center gap-2 bg-black/60 text-white px-3 py-1.5 rounded-full text-sm">
                <Icon icon="mdi:camera" />
                Cambiar banner
              </div>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleBannerChange}
              />
            </label>
          </div>

          <div className="px-4 sm:px-5 pb-4 sm:pb-5">
            {/* Foto de perfil */}
            <div className="relative -mt-10 mb-4 w-fit">
              <img
                src={fileFotoUrl || "https://placehold.co/80x80"}
                onError={(e) => (e.target.src = "https://placehold.co/80x80")}
                className="w-20 h-20 rounded-full object-cover border-4 border-white dark:border-neutral-900"
              />
              <label className="absolute bottom-0 right-0 bg-gray-800 text-white rounded-full p-1.5 cursor-pointer hover:bg-gray-700 transition-colors">
                <Icon icon="mdi:camera" className="text-sm" />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFotoChange}
                />
              </label>
            </div>

            {/* Nombre */}
            <div className="mb-4">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1 block">
                Nombre *
              </label>
              <input
                className="w-full px-4 py-2.5 bg-gray-100 dark:bg-neutral-800 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary transition"
                type="text"
                placeholder="Tu nombre"
                {...register("nombre", {
                  required: "El nombre es obligatorio",
                  minLength: { value: 3, message: "Mínimo 3 caracteres" },
                })}
              />
              {errors.nombre && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.nombre.message}
                </p>
              )}
            </div>

            {/* Bio */}
            <div className="mb-4">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1 block">
                Bio
              </label>
              <textarea
                className="w-full px-4 py-2.5 bg-gray-100 dark:bg-neutral-800 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary transition resize-none"
                placeholder="Cuéntanos algo sobre ti..."
                rows={3}
                maxLength={160}
                {...register("bio")}
              />
            </div>

            {/* Redes sociales */}
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-3">
              Redes sociales
            </p>

            <div className="flex flex-col gap-3 mb-6">
              <div className="flex items-center gap-3 bg-gray-100 dark:bg-neutral-800 rounded-xl px-4 py-2.5">
                <Icon
                  icon="mdi:instagram"
                  className="text-pink-500 text-xl shrink-0"
                />
                <input
                  className="flex-1 bg-transparent text-sm outline-none placeholder-gray-400"
                  placeholder="usuario de Instagram"
                  {...register("instagram")}
                />
              </div>
              <div className="flex items-center gap-3 bg-gray-100 dark:bg-neutral-800 rounded-xl px-4 py-2.5">
                <Icon
                  icon="mdi:twitter"
                  className="text-sky-400 text-xl shrink-0"
                />
                <input
                  className="flex-1 bg-transparent text-sm outline-none placeholder-gray-400"
                  placeholder="usuario de Twitter/X"
                  {...register("twitter")}
                />
              </div>
              <div className="flex items-center gap-3 bg-gray-100 dark:bg-neutral-800 rounded-xl px-4 py-2.5">
                <Icon
                  icon="mdi:web"
                  className="text-blue-400 text-xl shrink-0"
                />
                <input
                  className="flex-1 bg-transparent text-sm outline-none placeholder-gray-400"
                  placeholder="https://tusitio.com"
                  {...register("website")}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-primary text-white font-semibold py-3 rounded-xl hover:opacity-90 transition cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isPending ? "Guardando..." : "Guardar cambios"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
