import { Outlet } from "react-router-dom";
import { Sidebar } from "../components/Sidebar/Sidebar";
import { useMostrarUsuarioAuthQuery } from "../stack/UsuariosStack";

export const MainLayout = () => {
  const { isLoading, error } = useMostrarUsuarioAuthQuery();
  if (isLoading) {
    return <span>Cargando data...</span>;
  }
  if (error) {
    return <span>Error al cargar usuarios... {error.message} </span>;
  }
  return (
    <main className="flex justify-center h-screen overflow-hidden bg-white dark:bg-bg-dark text-black dark:text-white transition-colors duration-300">
      <section className="flex w-full max-w-[1300px] h-full">
        <Sidebar />
        <section className="flex-1 px-4 overflow-y-auto h-full">
          <Outlet />
        </section>
      </section>
    </main>
  );
};
