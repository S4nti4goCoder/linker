import { getRelativeTime } from "../../hooks/useRelativeTime";
import { useComentariosStore } from "../../store/ComentariosStore";
import { useRespuestasComentariosStore } from "../../store/RespuestasComentariosStore";
import { InputRespuestaAComentario } from "./InputRespuestaAComentario";
import { RespuestaCard } from "./RespuestaCard";
import {
  useToggleLikeComentarioMutate,
  useObtenerLikesComentarioQuery,
} from "../../stack/ComentariosStack";
import { useMostrarRespuestaComentariosQuery } from "../../stack/RespuestasComentariosStack";
import { Icon } from "@iconify/react";

export const ComentarioCard = ({ item }) => {
  const {
    respuestaActivaParaComentarioId,
    limpiarRespuestaActiva,
    setRespuestaActiva,
  } = useRespuestasComentariosStore();

  const { setItemSelect, itemSelect: itemSelectComentario } =
    useComentariosStore();

  const { data: likesData } = useObtenerLikesComentarioQuery(item?.id);
  const { mutate: toggleLike } = useToggleLikeComentarioMutate(item?.id);

  // ← Cada ComentarioCard tiene su propia query de respuestas
  const { data: respuestas = [] } = useMostrarRespuestaComentariosQuery(
    itemSelectComentario?.id === item?.id ? item?.id : null
  );

  return (
    <div className="pl-4">
      <div className="flex items-start gap-2 group relative w-full">
        <img
          src={item?.foto_usuario || "https://placehold.co/36x36"}
          onError={(e) => (e.target.src = "https://placehold.co/36x36")}
          alt={`Foto de ${item?.nombre_usuario}`}
          className="w-9 h-9 rounded-full object-cover"
        />
        <div className="flex-1 relative">
          <div className="relative bg-gray-100 dark:bg-neutral-800 p-2 rounded-xl text-sm w-fit max-w-[90%] flex gap-2">
            <section>
              <span className="font-semibold block text-xs">
                {item?.nombre_usuario}
              </span>
              <p>{item?.comentario}</p>
            </section>
          </div>

          {likesData?.count > 0 && (
            <div className="absolute -bottom-2 right-[10%] bg-white dark:bg-neutral-700 rounded-full px-1.5 py-0.5 flex items-center gap-1 shadow text-xs border border-gray-100 dark:border-neutral-600">
              <Icon icon="mdi:heart" className="text-red-500 text-xs" />
              <span>{likesData.count}</span>
            </div>
          )}

          <div className="flex gap-3 mt-2 text-xs text-gray-500 ml-2 relative">
            <span>{getRelativeTime(item?.fecha)}</span>
            <button
              onClick={() => toggleLike()}
              className={`font-semibold hover:underline cursor-pointer transition-colors ${
                likesData?.liked ? "text-red-500" : "hover:text-red-400"
              }`}
            >
              {likesData?.liked ? "❤️ Me gusta" : "Me gusta"}
            </button>
            <button
              className="hover:underline cursor-pointer"
              onClick={() =>
                respuestaActivaParaComentarioId === item?.id
                  ? limpiarRespuestaActiva()
                  : setRespuestaActiva(item?.id)
              }
            >
              {respuestaActivaParaComentarioId === item?.id
                ? "Cancelar"
                : "Responder"}
            </button>
          </div>

          {item?.respuestas_count > 0 && (
            <button
              className="text-gray-400 mt-2 text-xs hover:underline cursor-pointer"
              onClick={() => setItemSelect(item)}
            >
              {item?.respuestas_count === 1
                ? `Ver ${item?.respuestas_count} respuesta`
                : `Ver las ${item?.respuestas_count} respuestas`}
            </button>
          )}

          {itemSelectComentario?.id === item?.id &&
            respuestas.map((r, index) => (
              <RespuestaCard key={index} item={r} />
            ))}

          {respuestaActivaParaComentarioId === item?.id && (
            <div>
              <div className="w-4 h-4 border-l-2 border-b-2 border-gray-300 dark:border-gray-600 rounded-bl-lg absolute bottom-18 -ml-[29px]" />
              <InputRespuestaAComentario />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};