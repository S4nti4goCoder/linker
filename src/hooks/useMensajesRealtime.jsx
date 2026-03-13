import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "../supabase/supabase.config";
import { useUsuariosStore } from "../store/UsuariosStore";
import { useListarConversacionesQuery } from "../stack/MensajesStack";
import { useMensajesStore } from "../store/MensajesStore";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export const useMensajesRealtime = () => {
  const { dataUsuarioAuth } = useUsuariosStore();
  const { data: conversaciones = [] } = useListarConversacionesQuery();
  const { conversacionActiva } = useMensajesStore();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const convIdsKey = conversaciones.map((c) => c.id).join(",");

  // Ref para leer siempre el valor actual dentro del closure del canal
  const conversacionActivaRef = useRef(conversacionActiva);
  useEffect(() => {
    conversacionActivaRef.current = conversacionActiva;
  }, [conversacionActiva]);

  useEffect(() => {
    if (!dataUsuarioAuth?.id || conversaciones.length === 0) return;

    const misConvIds = new Set(conversaciones.map((c) => c.id));
    const convMap = new Map(conversaciones.map((c) => [c.id, c]));

    const channel = supabase
      .channel(`mensajes-realtime-${dataUsuarioAuth.id}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "mensajes" },
        (payload) => {
          const { id_conversacion, id_emisor, contenido } = payload.new;

          if (
            !misConvIds.has(id_conversacion) ||
            id_emisor === dataUsuarioAuth.id
          )
            return;

          // Siempre invalidar para actualizar badge y lista
          queryClient.invalidateQueries({
            queryKey: ["conversaciones", dataUsuarioAuth.id],
          });

          // Leer la ref — siempre tiene el valor actual sin importar cuándo se creó el closure
          if (conversacionActivaRef.current !== id_conversacion) {
            const conv = convMap.get(id_conversacion);
            toast.custom(
              (t) => (
                <button
                  onClick={() => {
                    toast.dismiss(t);
                    navigate("/mensajes");
                  }}
                  className="flex items-center gap-3 w-full bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 rounded-2xl shadow-lg px-4 py-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors text-left"
                >
                  <img
                    src={conv?.otro_foto || "https://placehold.co/40x40"}
                    onError={(e) =>
                      (e.target.src = "https://placehold.co/40x40")
                    }
                    className="w-10 h-10 rounded-full object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                      {conv?.otro_nombre ?? "Nuevo mensaje"}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {contenido}
                    </p>
                  </div>
                </button>
              ),
              { duration: 4000 },
            );
          }
        },
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [dataUsuarioAuth?.id, convIdsKey]); // ← conversacionActiva NO va aquí, se lee por ref
};
