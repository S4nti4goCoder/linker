import { Icon } from "@iconify/react";
import { useState } from "react";
import { SpinnerLocal } from "../components/ui/spinners/SpinnerLocal";
import {
  useReportesPendientesQuery,
  useDescartarReporteMutate,
  useEliminarPublicacionReportadaMutate,
  useUsuariosBaneadosQuery,
  useDesbanearUsuarioMutate,
  useBanearUsuarioMutate,
  useAdminLogQuery,
  useApelacionesPendientesQuery,
  useResolverApelacionMutate,
} from "../stack/ReportesStack";
import { useReportesStore } from "../store/ReportesStore";

// ── Tab Reportes ─────────────────────────────────
const ReportesSection = () => {
  const { data: reportes = [], isLoading } = useReportesPendientesQuery();
  const { mutate: descartar, isPending: isDescartando } = useDescartarReporteMutate();
  const { mutate: eliminar, isPending: isEliminando } = useEliminarPublicacionReportadaMutate();

  if (isLoading) return <SpinnerLocal />;

  if (reportes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-400">
        <Icon icon="mdi:check-circle-outline" className="text-5xl mb-3 text-green-400" />
        <p className="text-sm font-medium">Todo limpio</p>
        <p className="text-xs mt-1">No hay reportes pendientes</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-200 dark:divide-gray-700">
      {reportes.map((reporte) => (
        <div key={reporte.id} className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icon icon="mdi:flag" className="text-red-500" />
              <span className="text-xs font-semibold text-red-500">{reporte.motivo}</span>
            </div>
            <span className="text-xs text-gray-400">
              {new Date(reporte.fecha).toLocaleDateString()}
            </span>
          </div>

          <div className="bg-gray-50 dark:bg-neutral-800 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <img
                src={reporte.publicaciones?.usuarios?.foto_perfil || "https://placehold.co/32x32"}
                className="w-6 h-6 rounded-full object-cover"
              />
              <span className="text-xs font-semibold">
                {reporte.publicaciones?.usuarios?.nombre}
              </span>
            </div>
            {reporte.publicaciones?.descripcion && (
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                {reporte.publicaciones.descripcion}
              </p>
            )}
            {reporte.publicaciones?.url && reporte.publicaciones.url !== "-" && (
              reporte.publicaciones.type === "imagen" ? (
                <img src={reporte.publicaciones.url} className="max-h-40 rounded-lg object-contain" />
              ) : (
                <video src={reporte.publicaciones.url} controls className="max-h-40 rounded-lg" />
              )
            )}
          </div>

          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-400">
              Reportado por: <span className="font-medium">{reporte.usuarios?.nombre}</span>
            </p>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
              (reporte.publicaciones?.usuarios?.strikes ?? 0) >= 2
                ? "bg-red-100 text-red-600 dark:bg-red-500/20"
                : "bg-gray-100 text-gray-500 dark:bg-neutral-700"
            }`}>
              {reporte.publicaciones?.usuarios?.strikes ?? 0}/3 strikes
            </span>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => descartar(reporte.id)}
              disabled={isDescartando}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border border-gray-300 dark:border-neutral-600 hover:bg-gray-100 dark:hover:bg-neutral-800 cursor-pointer disabled:opacity-50"
            >
              <Icon icon="mdi:close" />
              Descartar
            </button>
            <button
              onClick={() => eliminar({
                id_reporte: reporte.id,
                id_publicacion: reporte.id_publicacion,
                id_autor: reporte.publicaciones?.id_usuario,
                motivo: reporte.motivo,
              })}
              disabled={isEliminando}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-red-500 text-white hover:bg-red-600 cursor-pointer disabled:opacity-50"
            >
              <Icon icon="mdi:trash-can-outline" />
              Eliminar publicación
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

// ── Tab Usuarios ─────────────────────────────────
const UsuariosSection = () => {
  const { data: baneados = [], isLoading } = useUsuariosBaneadosQuery();
  const { mutate: desbanear, isPending: isDesbaneando } = useDesbanearUsuarioMutate();
  const { mutate: banear, isPending: isBaneando } = useBanearUsuarioMutate();
  const { buscarUsuarioAdmin } = useReportesStore();
  const [busqueda, setBusqueda] = useState("");
  const [resultados, setResultados] = useState([]);
  const [buscando, setBuscando] = useState(false);

  const handleBuscar = async (query) => {
    setBusqueda(query);
    if (query.trim().length < 2) {
      setResultados([]);
      return;
    }
    setBuscando(true);
    const data = await buscarUsuarioAdmin(query);
    setResultados(data);
    setBuscando(false);
  };

  return (
    <div className="space-y-4">
      {/* Buscador para banear */}
      <div className="px-4 pt-4">
        <div className="relative">
          <Icon icon="mdi:magnify" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={busqueda}
            onChange={(e) => handleBuscar(e.target.value)}
            placeholder="Buscar usuario para banear..."
            className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-gray-100 dark:bg-neutral-800 text-sm outline-none"
          />
        </div>

        {busqueda.trim().length >= 2 && (
          <div className="mt-2 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-lg overflow-hidden">
            {buscando ? (
              <div className="p-3 text-center text-xs text-gray-400">Buscando...</div>
            ) : resultados.length === 0 ? (
              <div className="p-3 text-center text-xs text-gray-400">Sin resultados</div>
            ) : (
              resultados.map((usuario) => (
                <div key={usuario.id} className="flex items-center justify-between px-3 py-2.5 hover:bg-gray-50 dark:hover:bg-neutral-800">
                  <div className="flex items-center gap-2">
                    <img
                      src={usuario.foto_perfil || "https://placehold.co/32x32"}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-sm font-medium">{usuario.nombre}</p>
                      <p className="text-[10px] text-gray-400">{usuario.strikes}/3 strikes</p>
                    </div>
                  </div>
                  {usuario.baneado ? (
                    <button
                      onClick={() => desbanear(usuario.id)}
                      disabled={isDesbaneando}
                      className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-green-500 text-white hover:bg-green-600 cursor-pointer disabled:opacity-50"
                    >
                      Desbanear
                    </button>
                  ) : (
                    <button
                      onClick={() => banear(usuario.id)}
                      disabled={isBaneando}
                      className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-red-500 text-white hover:bg-red-600 cursor-pointer disabled:opacity-50"
                    >
                      Banear
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Lista de baneados */}
      <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-600">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <Icon icon="mdi:account-cancel" className="text-red-500" />
          Usuarios baneados
          {baneados.length > 0 && (
            <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded-full font-semibold">
              {baneados.length}
            </span>
          )}
        </h3>
      </div>

      {isLoading ? (
        <SpinnerLocal />
      ) : baneados.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-gray-400">
          <Icon icon="mdi:account-check-outline" className="text-4xl mb-2 text-green-400" />
          <p className="text-xs">No hay usuarios baneados</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {baneados.map((usuario) => (
            <div key={usuario.id} className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src={usuario.foto_perfil || "https://placehold.co/40x40"}
                    className="w-10 h-10 rounded-full object-cover opacity-50"
                  />
                  <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                    <Icon icon="mdi:close" className="text-white text-[8px]" />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold">{usuario.nombre}</p>
                  <p className="text-xs text-red-400">{usuario.strikes} strikes</p>
                </div>
              </div>
              <button
                onClick={() => desbanear(usuario.id)}
                disabled={isDesbaneando}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-green-500 text-white hover:bg-green-600 cursor-pointer disabled:opacity-50"
              >
                <Icon icon="mdi:account-check" />
                Desbanear
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ── Tab Historial ────────────────────────────────
const accionConfig = {
  strike: { icon: "mdi:alert-circle", color: "text-amber-500 bg-amber-100 dark:bg-amber-500/20", label: "Strike" },
  strike_y_baneo: { icon: "mdi:account-cancel", color: "text-red-500 bg-red-100 dark:bg-red-500/20", label: "Strike + Ban" },
  baneo_manual: { icon: "mdi:gavel", color: "text-red-500 bg-red-100 dark:bg-red-500/20", label: "Ban manual" },
  desbaneo: { icon: "mdi:account-check", color: "text-green-500 bg-green-100 dark:bg-green-500/20", label: "Desbaneo" },
  apelacion_aceptada: { icon: "mdi:check-decagram", color: "text-green-500 bg-green-100 dark:bg-green-500/20", label: "Apelación aceptada" },
  apelacion_rechazada: { icon: "mdi:close-octagon", color: "text-red-500 bg-red-100 dark:bg-red-500/20", label: "Apelación rechazada" },
};

const HistorialSection = () => {
  const { data: logs = [], isLoading } = useAdminLogQuery();

  if (isLoading) return <SpinnerLocal />;

  if (logs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-400">
        <Icon icon="mdi:history" className="text-5xl mb-3" />
        <p className="text-sm font-medium">Sin actividad</p>
        <p className="text-xs mt-1">El historial de acciones aparecerá aquí</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-200 dark:divide-gray-700">
      {logs.map((log) => {
        const config = accionConfig[log.accion] || accionConfig.strike;
        return (
          <div key={log.id} className="flex items-start gap-3 px-4 py-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${config.color}`}>
              <Icon icon={config.icon} className="text-sm" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <img
                  src={log.usuarios?.foto_perfil || "https://placehold.co/24x24"}
                  className="w-5 h-5 rounded-full object-cover"
                />
                <span className="text-sm font-semibold">{log.usuarios?.nombre}</span>
                <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${config.color}`}>
                  {config.label}
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{log.detalle}</p>
              <span className="text-[10px] text-gray-400">
                {new Date(log.fecha).toLocaleString()}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ── Tab Apelaciones ──────────────────────────────
const ApelacionesSection = () => {
  const { data: apelaciones = [], isLoading } = useApelacionesPendientesQuery();
  const { mutate: resolver, isPending } = useResolverApelacionMutate();
  const [respuestas, setRespuestas] = useState({});

  if (isLoading) return <SpinnerLocal />;

  if (apelaciones.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-400">
        <Icon icon="mdi:message-check-outline" className="text-5xl mb-3 text-green-400" />
        <p className="text-sm font-medium">Sin apelaciones</p>
        <p className="text-xs mt-1">No hay apelaciones pendientes</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-200 dark:divide-gray-700">
      {apelaciones.map((apelacion) => (
        <div key={apelacion.id} className="p-4 space-y-3">
          <div className="flex items-center gap-3">
            <img
              src={apelacion.usuarios?.foto_perfil || "https://placehold.co/40x40"}
              className="w-10 h-10 rounded-full object-cover opacity-60"
            />
            <div>
              <p className="text-sm font-semibold">{apelacion.usuarios?.nombre}</p>
              <p className="text-[10px] text-red-400">{apelacion.usuarios?.strikes}/3 strikes</p>
            </div>
            <span className="ml-auto text-xs text-gray-400">
              {new Date(apelacion.fecha).toLocaleDateString()}
            </span>
          </div>

          <div className="bg-gray-50 dark:bg-neutral-800 rounded-lg p-3">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Motivo de apelación:</p>
            <p className="text-sm text-gray-700 dark:text-gray-200">{apelacion.motivo}</p>
          </div>

          <textarea
            value={respuestas[apelacion.id] || ""}
            onChange={(e) => setRespuestas((prev) => ({ ...prev, [apelacion.id]: e.target.value }))}
            placeholder="Respuesta al usuario (opcional para aceptar, recomendado para rechazar)..."
            className="w-full bg-gray-100 dark:bg-neutral-800 rounded-lg p-3 text-xs outline-none resize-none"
            rows={2}
          />

          <div className="flex gap-2">
            <button
              onClick={() => resolver({
                id: apelacion.id,
                estado: "aceptada",
                respuesta_admin: respuestas[apelacion.id] || "",
                id_usuario: apelacion.id_usuario,
              })}
              disabled={isPending}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-green-500 text-white hover:bg-green-600 cursor-pointer disabled:opacity-50"
            >
              <Icon icon="mdi:check" />
              Aceptar (desbanear)
            </button>
            <button
              onClick={() => resolver({
                id: apelacion.id,
                estado: "rechazada",
                respuesta_admin: respuestas[apelacion.id] || "El ban es definitivo por infracciones graves a las normas.",
                id_usuario: apelacion.id_usuario,
              })}
              disabled={isPending}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-red-500 text-white hover:bg-red-600 cursor-pointer disabled:opacity-50"
            >
              <Icon icon="mdi:close" />
              Rechazar (ban definitivo)
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

// ── Página Admin ─────────────────────────────────
const AdminPage = () => {
  const [tab, setTab] = useState("reportes");
  const { data: reportes = [] } = useReportesPendientesQuery();
  const { data: baneados = [] } = useUsuariosBaneadosQuery();
  const { data: apelaciones = [] } = useApelacionesPendientesQuery();

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <header className="px-4 py-4 border-b border-gray-200 dark:border-gray-600">
        <div className="flex items-center gap-2">
          <Icon icon="mdi:shield-crown-outline" className="text-2xl text-primary" />
          <h1 className="text-xl font-bold">Administración</h1>
        </div>
        <p className="text-xs text-gray-400 mt-1">Gestiona reportes y usuarios de la comunidad</p>
      </header>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 dark:border-gray-600 sticky top-0 z-10 bg-white dark:bg-bg-dark">
        <button
          onClick={() => setTab("reportes")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold transition-colors cursor-pointer relative ${
            tab === "reportes"
              ? "text-red-500 border-b-2 border-red-500"
              : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          }`}
        >
          <Icon icon="mdi:flag-outline" width={18} />
          Reportes
          {reportes.length > 0 && (
            <span className="w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              {reportes.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setTab("usuarios")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold transition-colors cursor-pointer relative ${
            tab === "usuarios"
              ? "text-primary border-b-2 border-primary"
              : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          }`}
        >
          <Icon icon="mdi:account-group" width={18} />
          Usuarios
          {baneados.length > 0 && (
            <span className="w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              {baneados.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setTab("historial")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold transition-colors cursor-pointer ${
            tab === "historial"
              ? "text-primary border-b-2 border-primary"
              : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          }`}
        >
          <Icon icon="mdi:history" width={18} />
          Historial
        </button>
        <button
          onClick={() => setTab("apelaciones")}
          className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold transition-colors cursor-pointer relative ${
            tab === "apelaciones"
              ? "text-amber-500 border-b-2 border-amber-500"
              : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          }`}
        >
          <Icon icon="mdi:message-alert-outline" width={18} />
          Apelaciones
          {apelaciones.length > 0 && (
            <span className="w-5 h-5 bg-amber-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              {apelaciones.length}
            </span>
          )}
        </button>
      </div>

      <div className="overflow-y-auto h-full">
        {tab === "reportes" && <ReportesSection />}
        {tab === "usuarios" && <UsuariosSection />}
        {tab === "historial" && <HistorialSection />}
        {tab === "apelaciones" && <ApelacionesSection />}
      </div>
    </div>
  );
};

export default AdminPage;
