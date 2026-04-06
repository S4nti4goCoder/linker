const R2_WORKER_URL = import.meta.env.VITE_R2_WORKER_URL;
const R2_PUBLIC_URL = import.meta.env.VITE_R2_PUBLIC_URL;

export const subirArchivoR2 = async (ruta, file) => {
  const res = await fetch(`${R2_WORKER_URL}/${ruta}`, {
    method: "PUT",
    body: file,
    headers: { "Content-Type": file.type || "application/octet-stream" },
  });
  if (!res.ok) throw new Error("Error al subir archivo a R2");
  return `${R2_PUBLIC_URL}/${ruta}`;
};

export const eliminarArchivoR2 = async (ruta) => {
  const res = await fetch(`${R2_WORKER_URL}/${ruta}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Error al eliminar archivo de R2");
};

export const obtenerRutaDesdeUrl = (url) => {
  if (!url || url === "-") return null;
  // Extraer ruta desde URL de R2 o Supabase
  if (url.includes(R2_PUBLIC_URL)) {
    return url.replace(`${R2_PUBLIC_URL}/`, "");
  }
  // Compatibilidad con URLs antiguas de Supabase
  const parts = url.split("/archivos/");
  return parts[1] || null;
};
