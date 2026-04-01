import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { supabase } from "../supabase/supabase.config";

export const useSupabaseSubscription = ({ channelName, options, queryKey }) => {
  const queryClient = useQueryClient();

  // Serializar para comparar por valor, no por referencia
  const optionsKey = JSON.stringify(options);
  const queryKeyStr = JSON.stringify(queryKey);

  // Guardar queryKey actual en ref para usar dentro del callback
  const queryKeyRef = useRef(queryKey);
  useEffect(() => {
    queryKeyRef.current = queryKey;
  }, [queryKeyStr]);

  useEffect(() => {
    const parsedOptions = JSON.parse(optionsKey);

    const subscription = supabase
      .channel(channelName)
      .on("postgres_changes", parsedOptions, (payload) => {
        const { eventType } = payload;
        if (["INSERT", "UPDATE", "DELETE"].includes(eventType)) {
          queryClient.invalidateQueries(queryKeyRef.current);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [channelName, optionsKey, queryKeyStr]);
};
