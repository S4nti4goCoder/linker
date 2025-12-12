import { ImageSelectorFoto } from "../../hooks/useImageSelectorFoto";

export const FormActualizarPerfil = () => {
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
      </div>
    </div>
  );
};
