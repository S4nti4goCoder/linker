import { useEffect, useRef, useState } from "react";
import { Icon } from "@iconify/react";
import { useNotificacionesStore } from "../../store/NotificacionesStore";
import { useUsuariosStore } from "../../store/UsuariosStore";
import { supabase } from "../../supabase/supabase.config";
import { getRelativeTime } from "../../hooks/useRelativeTime";

const iconoTipo = {
  like: { icon: "mdi:heart", color: "text-red-500 bg-red-100 dark:bg-red-500/20" },
  comentario: { icon: "mdi:comment", color: "text-blue-500 bg-blue-100 dark:bg-blue-500/20" },
  respuesta: { icon: "mdi:reply", color: "text-green-500 bg-green-100 dark:bg-green-500/20" },
  seguidor: { icon: "mdi:account-plus", color: "text-purple-500 bg-purple-100 dark:bg-purple-500/20" },
  advertencia: { icon: "mdi:alert-circle", color: "text-amber-500 bg-amber-100 dark:bg-amber-500/20" },
};

const NotificacionItem = ({ notif, compact }) => {
  const tipo = iconoTipo[notif.tipo] || iconoTipo.like;
  return (
    <div className={`flex items-center gap-2.5 px-3 ${compact ? "py-2" : "py-3 px-4 gap-3"} hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors ${!notif.leida ? "bg-blue-50 dark:bg-blue-500/5" : ""}`}>
      <div className="relative shrink-0">
        <img
          src={notif.origen?.foto_perfil || "https://ui-avatars.com/api/?name=U"}
          className={`${compact ? "w-8 h-8" : "w-10 h-10"} rounded-full object-cover`}
        />
        <div className={`absolute -bottom-0.5 -right-0.5 ${compact ? "w-4 h-4" : "w-5 h-5"} rounded-full flex items-center justify-center ${tipo.color}`}>
          <Icon icon={tipo.icon} className={compact ? "text-[9px]" : "text-xs"} />
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <p className={`${compact ? "text-xs" : "text-sm"} text-gray-800 dark:text-gray-200 leading-snug`}>{notif.mensaje}</p>
        <span className={`${compact ? "text-[10px]" : "text-xs"} text-gray-400`}>{getRelativeTime(notif.fecha)}</span>
      </div>
      {!notif.leida && (
        <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
      )}
    </div>
  );
};

export const NotificacionesDropdown = () => {
  const [open, setOpen] = useState(false);
  const { notificaciones, noLeidas, obtenerNotificaciones, marcarTodasLeidas, agregarNotificacion } = useNotificacionesStore();
  const { dataUsuarioAuth } = useUsuariosStore();
  const ref = useRef(null);

  useEffect(() => {
    if (!dataUsuarioAuth?.id) return;
    obtenerNotificaciones(dataUsuarioAuth.id);

    const channel = supabase
      .channel(`notificaciones-${dataUsuarioAuth.id}`)
      .on("postgres_changes", {
        event: "INSERT",
        schema: "public",
        table: "notificaciones",
        filter: `id_usuario_destino=eq.${dataUsuarioAuth.id}`,
      }, async (payload) => {
        const { data, error } = await supabase
          .from("notificaciones")
          .select(`*, origen:id_usuario_origen(nombre, foto_perfil)`)
          .eq("id", payload.new.id)
          .maybeSingle();
        if (!error && data) agregarNotificacion(data);
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [dataUsuarioAuth?.id]);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleOpen = () => {
    setOpen(!open);
    if (!open && noLeidas > 0) marcarTodasLeidas(dataUsuarioAuth.id);
  };

  return (
    <div className="relative w-full" ref={ref}>
      <button
        onClick={handleOpen}
        className="flex items-center gap-3 p-2 rounded-lg font-semibold hover:bg-gray-100 dark:hover:bg-primary/10 dark:hover:text-primary transition-all w-full justify-center sm:justify-start text-gray-600 dark:text-gray-400 cursor-pointer relative"
      >
        <div className="relative">
          <Icon icon="ic:baseline-notifications" width={24} height={24} />
          {noLeidas > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              {noLeidas > 9 ? "9+" : noLeidas}
            </span>
          )}
        </div>
        <span className="hidden sm:block text-sm">Notificaciones</span>
      </button>

      {open && (
        <>
          {/* Mobile: modal fullscreen */}
          <div className="md:hidden fixed inset-0 z-50 bg-black/50 animate-fade-in" onClick={() => setOpen(false)}>
            <div
              className="absolute bottom-0 left-0 right-0 bg-white dark:bg-neutral-900 rounded-t-2xl max-h-[65vh] flex flex-col animate-slide-up"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-neutral-700">
                <h3 className="font-bold text-sm">Notificaciones</h3>
                <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                  <Icon icon="mdi:close" className="text-xl" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">
                {notificaciones.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 gap-2 text-gray-400">
                    <Icon icon="mdi:bell-off-outline" className="text-3xl" />
                    <p className="text-xs">Sin notificaciones</p>
                  </div>
                ) : (
                  notificaciones.map((notif) => (
                    <NotificacionItem key={notif.id} notif={notif} compact />
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Desktop: dropdown */}
          <div className="hidden md:block absolute left-full top-0 ml-2 w-80 bg-white dark:bg-neutral-900 rounded-xl shadow-2xl border border-gray-200 dark:border-neutral-700 z-50 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-neutral-700">
              <h3 className="font-bold text-sm">Notificaciones</h3>
              {noLeidas > 0 && (
                <button
                  onClick={() => marcarTodasLeidas(dataUsuarioAuth.id)}
                  className="text-xs text-primary hover:underline cursor-pointer"
                >
                  Marcar todas como leídas
                </button>
              )}
            </div>
            <div className="max-h-96 overflow-y-auto">
              {notificaciones.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 gap-2 text-gray-400">
                  <Icon icon="mdi:bell-off-outline" className="text-4xl" />
                  <p className="text-sm">Sin notificaciones</p>
                </div>
              ) : (
                notificaciones.map((notif) => (
                  <NotificacionItem key={notif.id} notif={notif} />
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};