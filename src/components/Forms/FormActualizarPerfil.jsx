import { useForm } from "react-hook-form";
import { ImageSelectorFoto } from "../../hooks/useImageSelectorFoto";
import { useEditarFotoUserMutate } from "../../stack/UsuariosStack";

export const FormActualizarPerfil = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const {mutate} = useEditarFotoUserMutate()
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-lg w-full max-w-md p-6">
        <h1 className="text-2xl font-bold text-center mb-4">
          Actualización de datos
        </h1>
        <section className="flex flex-col items-center gap-3 mg-6">
          <span className="text-gray-500 dark:text-gray-300">
            Agrega tu foto de perfil
          </span>
          <ImageSelectorFoto />
        </section>
        <form onSubmit={handleSubmit(mutate)}>
          <div className="mb-4">
            <input
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00aff0]"
              type="text"
              placeholder="Nombre"
              {...register("nombre", {
                required: "El nombre es obligatorio",
                minLength: {
                  value: 3,
                  message: "Debe tener al menos 3 caracteres",
                },
              })}
            />
            <p className="py-1 text-red-500 font-bold">
              {errors.nombre?.message}{" "}
            </p>
          </div>
          <button
            type="submit"
            className="cursor-pointer w-full bg-gray-200 text-gray-500 font-medium py-3 rounded-full hover:bg-[#00AFF0] hover:text-white transition duration-200"
          >
            GUARDAR
          </button>
        </form>
      </div>
    </div>
  );
};
