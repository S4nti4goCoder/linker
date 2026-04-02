import { Icon } from "@iconify/react";

export const BtnClose = ({ funcion }) => {
  return (
    <button
      aria-label="Cerrar"
      className="absolute top-3 right-3 cursor-pointer bg-transparent border-none p-0"
      onClick={() => funcion()}
    >
      <Icon icon="ep:close-bold" width={20} height={20} />
    </button>
  );
};
