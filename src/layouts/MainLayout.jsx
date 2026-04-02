import { Outlet } from "react-router-dom";
import { Sidebar } from "../components/Sidebar/Sidebar";
import { useMostrarUsuarioAuthQuery } from "../stack/UsuariosStack";
import { useMensajesRealtime } from "../hooks/useMensajesRealtime";

export const MainLayout = () => {
  const { isLoading, error } = useMostrarUsuarioAuthQuery();
  useMensajesRealtime();

  if (isLoading) {
    return <span>Cargando data...</span>;
  }
  if (error) {
    return <span>Error al cargar usuarios... {error.message}</span>;
  }

  return (
    <main className="flex justify-center h-screen overflow-hidden bg-white dark:bg-bg-dark text-black dark:text-white transition-colors duration-300">
      <section className="flex w-full max-w-[1300px] h-full">
        <Sidebar />
        <section className="flex-1 overflow-y-auto h-full border-x border-gray-200 dark:border-gray-600">
          <Outlet />
        </section>
      </section>
    </main>
  );
};