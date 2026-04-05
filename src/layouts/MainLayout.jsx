import { Outlet } from "react-router-dom";
import { Sidebar } from "../components/Sidebar/Sidebar";
import { useMostrarUsuarioAuthQuery } from "../stack/UsuariosStack";
import { useMensajesRealtime } from "../hooks/useMensajesRealtime";
import { useOnlineStatus } from "../hooks/useOnlineStatus";
import logo from "../assets/logo.png";

const SplashScreen = () => (
  <div className="flex flex-col items-center justify-center h-screen bg-white dark:bg-bg-dark">
    <img src={logo} alt="LinKer" className="h-16 w-16 animate-pulse" />
    <span className="mt-4 text-xl font-bold text-gray-800 dark:text-white tracking-tight">
      LinKer
    </span>
    <div className="mt-6 flex gap-1.5">
      <span className="h-2 w-2 rounded-full bg-primary animate-bounce [animation-delay:0ms]" />
      <span className="h-2 w-2 rounded-full bg-primary animate-bounce [animation-delay:150ms]" />
      <span className="h-2 w-2 rounded-full bg-primary animate-bounce [animation-delay:300ms]" />
    </div>
  </div>
);

export const MainLayout = () => {
  const { isLoading, error } = useMostrarUsuarioAuthQuery();
  useMensajesRealtime();
  useOnlineStatus();

  if (isLoading) {
    return <SplashScreen />;
  }
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-white dark:bg-bg-dark text-gray-500 gap-3">
        <img src={logo} alt="LinKer" className="h-14 w-14 opacity-50" />
        <p className="text-sm">Error al cargar: {error.message}</p>
      </div>
    );
  }

  return (
    <main className="flex justify-center h-screen overflow-hidden bg-white dark:bg-bg-dark text-black dark:text-white transition-colors duration-300 pt-12 md:pt-0">
      <section className="flex w-full max-w-[1300px] h-full">
        <Sidebar />
        <section className="flex-1 overflow-y-auto h-full border-x border-gray-200 dark:border-gray-600">
          <Outlet />
        </section>
        <div className="w-[200px] shrink-0 hidden lg:block" />
      </section>
    </main>
  );
};