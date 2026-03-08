export function useFormattedDate() {
  const fechaActual = new Date();
  const offset = fechaActual.getTimezoneOffset() * 60000;
  return new Date(fechaActual - offset)
    .toISOString()
    .slice(0, 19)
    .replace("T", " ");
}
