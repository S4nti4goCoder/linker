import { Icon } from "@iconify/react";

export const BtnClose = ({ funcion }) => {
  return (
    <div className="absolute top-3 right-3 cursor-pointer" onClick={funcion}>
      <Icon icon="ep:close-bold" width={20} height={20} />
    </div>
  );
};
