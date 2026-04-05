import { Icon } from "@iconify/react";
import { useState, useRef, useEffect } from "react";

export const CreatorBadge = ({ size = 18 }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const close = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, [open]);

  return (
    <span
      ref={ref}
      className={`creator-badge text-primary cursor-pointer ${open ? "active" : ""}`}
      onClick={(e) => {
        e.stopPropagation();
        setOpen(!open);
      }}
    >
      <Icon icon="mdi:check-decagram" width={size} height={size} />
    </span>
  );
};
