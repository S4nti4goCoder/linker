import { useRef, useState } from "react";
import { useImageExtractColor } from "../../hooks/useImageExtractColor";
import { Icon } from "@iconify/react";

export const PostImageFrame = ({ src }) => {
  const imgRef = useRef(null);
  const bgColor = useImageExtractColor(imgRef, src);
  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        className="group relative rounded-lg overflow-hidden flex items-center justify-center max-h-[500px] cursor-pointer"
        style={{ backgroundColor: bgColor }}
        onClick={() => setOpen(true)}
      >
        <img
          ref={imgRef}
          src={src}
          crossOrigin="anonymous"
          className="object-contain max-h-[500px]"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
          <Icon icon="mdi:eye-outline" width={28} height={28} className="text-white/70" />
        </div>
      </div>

      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center animate-fade-in"
          onClick={() => setOpen(false)}
        >
          <button
            onClick={() => setOpen(false)}
            className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors cursor-pointer"
            aria-label="Cerrar imagen"
          >
            <Icon icon="mdi:close" width={28} height={28} />
          </button>
          <img
            src={src}
            className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
};
