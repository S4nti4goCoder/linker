import { Icon } from "@iconify/react/dist/iconify.js";
import { useRelativeTime } from "../../hooks/useRelativeTime";

export const RespuestaCard = ({ item }) => {
  return (
    <div className="flex-1 flex relative gap-3 ">
      <div className="w-10 h-4 border-l-2 border-b-2 border-gray-300 dark:border-gray-600 rounded-bl-lg -ml-[29px]" />
      <div className="flex-1">
        <div className="relative bg-gray-100 dark:bg-neutral-800 p-2 rounded-xl text-sm w-fit max-w-[90%] flex gap-2 ">
          <img
            src={item?.usuarios?.foto_perfil || "https://placehold.co/40x40"}
            className="w-9 h-9 rounded-full object-cover"
            alt="avatar"
          />
          <section>
            <span className="font-semibold block text-xs">
              {item?.usuarios.nombre}
            </span>
            <p>{item.comentario} </p>
          </section>

          <div className="hidden  group-hover:flex transition-opacity">
            <button className="text-gray-400 hover:text-gray-600">
              <Icon icon="mdi:dots-horizontal" className="text-xl" />
            </button>
          </div>
        </div>
        <div className="flex gap-3 mt-1 text-xs text-gray-500 ml-2 relative">
          <span>{useRelativeTime(item.fecha)} </span>
        </div>
      </div>
    </div>
  );
};
