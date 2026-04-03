export const isValidUrl = (url) => {
  try {
    const parsed = new URL(url);
    return ["http:", "https:"].includes(parsed.protocol);
  } catch {
    return false;
  }
};

export const isValidUsername = (username) =>
  /^[a-zA-Z0-9_.]{1,30}$/.test(username);

const ALLOWED_IMAGE_EXTS = ["jpg", "jpeg", "png", "gif", "webp"];
const ALLOWED_VIDEO_EXTS = ["mp4", "mov", "webm"];
const ALLOWED_EXTS = [...ALLOWED_IMAGE_EXTS, ...ALLOWED_VIDEO_EXTS];

export const getValidatedExt = (filename) => {
  const ext = filename?.split(".").pop()?.toLowerCase();
  if (!ALLOWED_EXTS.includes(ext)) {
    throw new Error("Tipo de archivo no permitido");
  }
  return ext;
};
