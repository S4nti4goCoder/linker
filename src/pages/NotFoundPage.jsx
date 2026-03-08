import { useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";

export const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-white dark:bg-bg-dark flex items-center justify-center px-4">
      <div className="flex flex-col items-center text-center gap-6 max-w-md">
        <div className="relative">
          <span className="text-[120px] font-black text-gray-100 dark:text-neutral-800 leading-none select-none">
            404
          </span>
          <Icon
            icon="mdi:magnify"
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-6xl text-gray-300 dark:text-neutral-600"
          />
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Página no encontrada
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            La página que buscas no existe o fue movida.
          </p>
        </div>
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-full font-semibold text-sm hover:opacity-90 transition-opacity cursor-pointer"
        >
          <Icon icon="mdi:home" className="text-lg" />
          Volver al inicio
        </button>
      </div>
    </main>
  );
};