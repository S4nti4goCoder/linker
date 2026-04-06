import { Outlet } from "react-router-dom";
import { Sidebar } from "../components/Sidebar/Sidebar";
import { useMostrarUsuarioAuthQuery } from "../stack/UsuariosStack";
import { useMensajesRealtime } from "../hooks/useMensajesRealtime";
import { useOnlineStatus } from "../hooks/useOnlineStatus";
import { useUsuariosStore } from "../store/UsuariosStore";
import { useAuthStore } from "../store/AuthStore";
import { Icon } from "@iconify/react";
import { useState } from "react";
import { useMiApelacionQuery, useEnviarApelacionMutate } from "../stack/ReportesStack";
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

const BannedScreen = ({ userId }) => {
  const { cerrarSesion } = useAuthStore();
  const [showApelacion, setShowApelacion] = useState(false);
  const [motivo, setMotivo] = useState("");
  const { data: apelacion } = useMiApelacionQuery(userId);
  const { mutate: enviarApelacion, isPending } = useEnviarApelacionMutate();

  const yaApelo = apelacion?.estado === "pendiente";
  const rechazada = apelacion?.estado === "rechazada";

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-white dark:bg-bg-dark text-center px-6 gap-4">
      <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-500/20 flex items-center justify-center">
        <Icon icon="mdi:account-cancel" className="text-4xl text-red-500" />
      </div>
      <h1 className="text-xl font-bold text-gray-800 dark:text-white">Cuenta suspendida</h1>

      {rechazada ? (
        <div className="max-w-sm space-y-3">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Tu apelación fue revisada y rechazada. Este ban es definitivo.
          </p>
          {apelacion?.respuesta_admin && (
            <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-lg p-3">
              <p className="text-xs text-red-600 dark:text-red-400 font-medium mb-1">Respuesta del administrador:</p>
              <p className="text-sm text-red-700 dark:text-red-300">{apelacion.respuesta_admin}</p>
            </div>
          )}
        </div>
      ) : yaApelo ? (
        <div className="max-w-sm space-y-2">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Tu apelación fue enviada y está en revisión. Te notificaremos cuando sea resuelta.
          </p>
          <div className="flex items-center justify-center gap-2 text-amber-500">
            <Icon icon="mdi:clock-outline" />
            <span className="text-xs font-medium">Pendiente de revisión</span>
          </div>
        </div>
      ) : (
        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm">
          Tu cuenta ha sido suspendida por infracciones repetidas a las normas de la comunidad.
        </p>
      )}

      <div className="flex gap-3">
        {!yaApelo && !rechazada && (
          <button
            onClick={() => setShowApelacion(true)}
            className="px-5 py-2 bg-primary text-white rounded-full text-sm font-semibold hover:bg-primary/90 transition-colors cursor-pointer"
          >
            Apelar suspensión
          </button>
        )}
        <button
          onClick={cerrarSesion}
          className="px-5 py-2 bg-red-500 text-white rounded-full text-sm font-semibold hover:bg-red-600 transition-colors cursor-pointer"
        >
          Cerrar sesión
        </button>
      </div>

      {/* Modal de apelación */}
      {showApelacion && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-neutral-900 rounded-xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Icon icon="mdi:message-alert-outline" className="text-2xl text-primary" />
              <h2 className="text-lg font-bold text-gray-800 dark:text-white">Apelar suspensión</h2>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Explica por qué crees que tu cuenta no debería estar suspendida. Un administrador revisará tu caso.
            </p>
            <textarea
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              placeholder="Escribe tu justificación aquí..."
              className="w-full bg-gray-100 dark:bg-neutral-800 rounded-lg p-3 text-sm outline-none resize-none text-gray-800 dark:text-gray-200"
              rows={5}
              maxLength={500}
            />
            <p className="text-xs text-gray-400 text-right">{motivo.length}/500</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowApelacion(false)}
                className="flex-1 px-4 py-2.5 rounded-lg text-sm border border-gray-300 dark:border-neutral-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-neutral-800 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  enviarApelacion({ id_usuario: userId, motivo });
                  setShowApelacion(false);
                  setMotivo("");
                }}
                disabled={motivo.trim().length < 10 || isPending}
                className="flex-1 px-4 py-2.5 rounded-lg text-sm bg-primary text-white font-semibold hover:bg-primary/90 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPending ? "Enviando..." : "Enviar apelación"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const MainLayout = () => {
  const { isLoading, error } = useMostrarUsuarioAuthQuery();
  const { dataUsuarioAuth } = useUsuariosStore();
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

  if (dataUsuarioAuth?.baneado) {
    return <BannedScreen userId={dataUsuarioAuth.id} />;
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