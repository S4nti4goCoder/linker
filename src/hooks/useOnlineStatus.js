import { useEffect } from "react";
import { supabase } from "../supabase/supabase.config";
import { useUsuariosStore } from "../store/UsuariosStore";

const INTERVAL_MS = 60_000; // cada 60 segundos

export const useOnlineStatus = () => {
  const { dataUsuarioAuth } = useUsuariosStore();

  useEffect(() => {
    if (!dataUsuarioAuth?.id) return;

    const update = () =>
      supabase
        .from("usuarios")
        .update({ ultimo_acceso: new Date().toISOString() })
        .eq("id", dataUsuarioAuth.id)
        .then(() => {})
        .catch(() => {});

    // Actualizar al montar y al volver a la pestaña
    update();
    const interval = setInterval(update, INTERVAL_MS);

    const onFocus = () => update();
    window.addEventListener("focus", onFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", onFocus);
    };
  }, [dataUsuarioAuth?.id]);
};

const ONLINE_THRESHOLD = 5 * 60 * 1000; // 5 minutos

export const isOnline = (ultimo_acceso) => {
  if (!ultimo_acceso) return false;
  return Date.now() - new Date(ultimo_acceso).getTime() < ONLINE_THRESHOLD;
};

export const getLastSeenText = (ultimo_acceso) => {
  if (!ultimo_acceso) return "";
  if (isOnline(ultimo_acceso)) return "En línea";

  const diff = Date.now() - new Date(ultimo_acceso).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 60) return `Hace ${mins} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `Hace ${hours}h`;
  const days = Math.floor(hours / 24);
  return `Hace ${days}d`;
};
