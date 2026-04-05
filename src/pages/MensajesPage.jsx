import { useEffect, useRef, useState } from "react";
import { Icon } from "@iconify/react";
import { useUsuariosStore } from "../store/UsuariosStore";
import { useMensajesStore } from "../store/MensajesStore";
import {
  useListarConversacionesQuery,
  useObtenerMensajesQuery,
  useEnviarMensajeMutate,
} from "../stack/MensajesStack";
import { useNavigate } from "react-router-dom";
import { getRelativeTime } from "../hooks/useRelativeTime";
import { isOnline, getLastSeenText } from "../hooks/useOnlineStatus";
import { useUltimoAccesoQuery } from "../stack/UsuariosStack";
import { SpinnerLocal } from "../components/ui/spinners/SpinnerLocal";
import { SkeletonMessage } from "../components/ui/spinners/SkeletonMessage";
import { useQueryClient } from "@tanstack/react-query";

const ConversacionItem = ({ conv, activa, onClick }) => {
  const { data: ultimoAcceso } = useUltimoAccesoQuery(conv.otro_id);
  const online = isOnline(ultimoAcceso);

  return (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 transition-colors cursor-pointer text-left hover:bg-gray-100 dark:hover:bg-neutral-800 ${
      activa ? "bg-gray-100 dark:bg-neutral-800" : ""
    }`}
  >
    <div className="relative shrink-0">
      <img
        src={conv.otro_foto || "https://placehold.co/44x44"}
        onError={(e) => (e.target.src = "https://placehold.co/44x44")}
        alt={`Foto de ${conv.otro_nombre}`}
        className="w-11 h-11 rounded-full object-cover"
      />
      {online && (
        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-bg-dark rounded-full" />
      )}
      {conv.no_leidos > 0 && (
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center">
          {conv.no_leidos > 9 ? "9+" : conv.no_leidos}
        </span>
      )}
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex justify-between items-center">
        <span className="font-semibold text-sm truncate">
          {conv.otro_nombre}
        </span>
        <span className="text-xs text-gray-400 shrink-0 ml-2">
          {conv.ultima_fecha ? getRelativeTime(conv.ultima_fecha) : ""}
        </span>
      </div>
      <p
        className={`text-xs truncate mt-0.5 ${
          conv.no_leidos > 0 ? "text-primary font-semibold" : "text-gray-400"
        }`}
      >
        {conv.ultimo_mensaje || "Inicia la conversación"}
      </p>
    </div>
  </button>
  );
};

const BurbujaMensaje = ({ mensaje, esPropio }) => (
  <div className={`flex ${esPropio ? "justify-end" : "justify-start"} mb-1`}>
    <div
      className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm wrap-break-words ${
        esPropio
          ? "bg-primary text-white rounded-br-sm"
          : "bg-gray-100 dark:bg-neutral-800 text-black dark:text-white rounded-bl-sm"
      }`}
    >
      <p>{mensaje.contenido}</p>
      <span
        className={`text-[10px] mt-0.5 block ${
          esPropio ? "text-white/70 text-right" : "text-gray-400"
        }`}
      >
        {getRelativeTime(mensaje.fecha)}
        {esPropio && (
          <Icon
            icon={mensaje.leido ? "mdi:check-all" : "mdi:check"}
            className={`inline ml-1 ${
              mensaje.leido ? "text-white" : "text-white/60"
            }`}
          />
        )}
      </span>
    </div>
  </div>
);

const VistaChatActivo = ({ id_conversacion, onVolver }) => {
  const navigate = useNavigate();
  const { dataUsuarioAuth } = useUsuariosStore();
  const { marcarMensajesLeidos } = useMensajesStore();
  const { data: conversaciones = [] } = useListarConversacionesQuery();
  const { data: mensajes = [], isLoading } =
    useObtenerMensajesQuery(id_conversacion);
  const { mutate: enviar, isPending } = useEnviarMensajeMutate(id_conversacion);
  const [texto, setTexto] = useState("");
  const bottomRef = useRef(null);
  const queryClient = useQueryClient();

  const conv = conversaciones.find((c) => c.id === id_conversacion);
  const otroUsuario = conv
    ? { nombre: conv.otro_nombre, foto_perfil: conv.otro_foto }
    : null;
  const { data: ultimoAccesoChat } = useUltimoAccesoQuery(conv?.otro_id);
  const onlineChat = isOnline(ultimoAccesoChat);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensajes]);

  useEffect(() => {
    if (!id_conversacion || !dataUsuarioAuth?.id) return;
    marcarMensajesLeidos({
      id_conversacion,
      id_receptor: dataUsuarioAuth.id,
    }).then(() => {
      queryClient.invalidateQueries({
        queryKey: ["conversaciones", dataUsuarioAuth.id],
      });
    });
  }, [id_conversacion, dataUsuarioAuth?.id]);

  const handleEnviar = () => {
    if (!texto.trim() || isPending) return;
    enviar(texto);
    setTexto("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleEnviar();
    }
  };

  return (
    <div className="flex flex-col h-full">
      <header className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 dark:border-gray-700 shrink-0">
        <button
          onClick={onVolver}
          className="sm:hidden p-1 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800 cursor-pointer"
        >
          <Icon icon="mdi:arrow-left" className="text-xl" />
        </button>
        <div
          className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => navigate(`/perfil/${conv?.otro_id}`)}
        >
          <div className="relative">
            <img
              src={otroUsuario?.foto_perfil || "https://placehold.co/40x40"}
              onError={(e) => (e.target.src = "https://placehold.co/40x40")}
              alt={`Foto de ${otroUsuario?.nombre}`}
              className="w-10 h-10 rounded-full object-cover"
            />
            {onlineChat && (
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-bg-dark rounded-full" />
            )}
          </div>
          <div>
            <p className="font-semibold text-sm hover:underline">
              {otroUsuario?.nombre || "Cargando..."}
            </p>
            <p className={`text-xs ${onlineChat ? "text-green-500" : "text-gray-400"}`}>
              {ultimoAccesoChat ? getLastSeenText(ultimoAccesoChat) : "Mensaje directo"}
            </p>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        {isLoading ? (
          <SpinnerLocal />
        ) : mensajes.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-gray-400">
            <Icon icon="mdi:message-outline" className="text-5xl" />
            <p className="text-sm">Sé el primero en escribir</p>
          </div>
        ) : (
          <>
            {mensajes.map((msg) => (
              <BurbujaMensaje
                key={msg.id}
                mensaje={msg}
                esPropio={msg.id_emisor === dataUsuarioAuth?.id}
              />
            ))}
            <div ref={bottomRef} />
          </>
        )}
      </div>

      <footer className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 shrink-0">
        <div className="flex items-end gap-2 bg-gray-100 dark:bg-neutral-800 rounded-2xl px-4 py-2">
          <textarea
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Escribe un mensaje..."
            rows={1}
            className="flex-1 bg-transparent outline-none resize-none text-sm placeholder-gray-400 dark:placeholder-gray-500 max-h-28"
          />
          <button
            onClick={handleEnviar}
            disabled={!texto.trim() || isPending}
            className="p-1.5 rounded-full bg-primary text-white disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-opacity shrink-0"
          >
            <Icon icon="mdi:send" className="text-lg" />
          </button>
        </div>
        <p className="text-[10px] text-gray-400 mt-1 text-center">
          Enter para enviar · Shift+Enter para nueva línea
        </p>
      </footer>
    </div>
  );
};

const MensajesPage = () => {
  const { conversacionActiva, setConversacionActiva } = useMensajesStore();
  const { data: conversaciones = [], isLoading } =
    useListarConversacionesQuery();
  const [mostrarChat, setMostrarChat] = useState(false);

  // ← Fix: limpiar conversación activa al salir de la página
  useEffect(() => {
    return () => {
      setConversacionActiva(null);
    };
  }, []);

  const abrirConversacion = (conv) => {
    setConversacionActiva(conv.id);
    setMostrarChat(true);
  };

  const volverALista = () => {
    setMostrarChat(false);
  };

  return (
    <div className="flex h-full overflow-hidden">
      <aside
        className={`w-full sm:w-80 shrink-0 border-r border-gray-200 dark:border-gray-700 flex flex-col h-full ${
          mostrarChat ? "hidden sm:flex" : "flex"
        }`}
      >
        <header className="px-4 py-4 border-b border-gray-200 dark:border-gray-700 shrink-0">
          <h1 className="text-xl font-bold">Mensajes</h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Solo puedes chatear con seguidores mutuos
          </p>
        </header>

        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <SkeletonMessage />
          ) : conversaciones.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-gray-400 px-6 text-center">
              <Icon icon="mdi:message-off-outline" className="text-5xl" />
              <p className="text-sm">
                Aún no tienes conversaciones. Sigue a alguien y espera que te
                siga de vuelta para chatear.
              </p>
            </div>
          ) : (
            conversaciones.map((conv) => (
              <ConversacionItem
                key={conv.id}
                conv={conv}
                activa={conversacionActiva === conv.id}
                onClick={() => abrirConversacion(conv)}
              />
            ))
          )}
        </div>
      </aside>

      <section
        className={`flex-1 h-full ${
          mostrarChat ? "flex flex-col" : "hidden sm:flex sm:flex-col"
        }`}
      >
        {!conversacionActiva ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-gray-400">
            <Icon icon="mdi:message-text-outline" className="text-6xl" />
            <p className="text-sm">Selecciona una conversación para comenzar</p>
          </div>
        ) : (
          <VistaChatActivo
            id_conversacion={conversacionActiva}
            onVolver={volverALista}
          />
        )}
      </section>
    </div>
  );
};

export default MensajesPage;
