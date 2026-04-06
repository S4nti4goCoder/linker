// Lista de palabras prohibidas (español e inglés)
const BLOCKED_WORDS = [
  // Español - contenido sexual explícito
  "porno", "pornografia", "pornografía", "xxx", "sexo oral", "nudes",
  "desnuda", "desnudo", "orgía", "orgia", "masturbacion", "masturbación",
  "prostituta", "escort", "onlyfans", "stripper", "hentai",
  "zoofilia", "pedofilia", "pedófilo", "pedofilo",
  // Inglés - contenido sexual explícito
  "porn", "nsfw", "nude", "naked", "blowjob", "handjob",
  "threesome", "gangbang", "milf", "dilf", "bdsm",
  "fetish", "camgirl", "sexting",
  // Violencia extrema
  "gore", "snuff", "mutilación", "mutilacion", "decapitacion", "decapitación",
  // Drogas
  "cocaina", "cocaína", "heroina", "heroína", "metanfetamina", "crack",
  "fentanilo", "éxtasis", "extasis",
];

// Normaliza texto: quita acentos, pasa a minúscula, elimina caracteres repetidos
const normalize = (text) =>
  text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/(.)\1{2,}/g, "$1$1") // "poorrno" → "poorno"
    .replace(/[^a-z0-9\s]/g, " ");

/**
 * Verifica si un texto contiene contenido prohibido.
 * Retorna { blocked: boolean, word: string | null }
 */
export const checkText = (text) => {
  if (!text) return { blocked: false, word: null };
  const normalized = normalize(text);

  for (const word of BLOCKED_WORDS) {
    const normalizedWord = normalize(word);
    // Buscar como palabra completa o como parte de una palabra compuesta
    const regex = new RegExp(`\\b${normalizedWord}\\b|${normalizedWord}`, "i");
    if (regex.test(normalized)) {
      return { blocked: true, word };
    }
  }

  return { blocked: false, word: null };
};

export const CONTENT_BLOCKED_MESSAGE =
  "Tu contenido fue bloqueado porque contiene material no permitido. LinKer prohíbe contenido +18, violencia extrema y promoción de sustancias ilegales.";
