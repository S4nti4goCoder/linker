import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "../supabase/supabase.config";
import { useUsuariosStore } from "../store/UsuariosStore";
import { useListarConversacionesQuery } from "../stack/MensajesStack";

export const useMensajesRealtime = () => {
  const { dataUsuarioAuth } = useUsuariosStore();
  const { data: conversaciones = [] } = useListarConversacionesQuery();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!dataUsuarioAuth?.id || conversaciones.length === 0) return;

    const misConvIds = conversaciones.map((c) => c.id);

    const channel = supabase
      .channel(`mensajes-realtime-${dataUsuarioAuth.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "mensajes",
        },
        (payload) => {
          if (
            misConvIds.includes(payload.new.id_conversacion) &&
            payload.new.id_emisor !== dataUsuarioAuth.id
          ) {
            queryClient.invalidateQueries({
              queryKey: ["conversaciones", dataUsuarioAuth.id],
            });
          }
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [dataUsuarioAuth?.id, conversaciones.length]);
};