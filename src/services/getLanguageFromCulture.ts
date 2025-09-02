import type { Culture } from "../types/Culture";
import type { Language } from "../types/Language";

/**
 * Extracts the language code from a Culture object or string.
 * Supports both objects with a language property and culture strings like "en-US".
 */
export function getLanguageFromCulture(culture: Culture): Language | undefined {
  if (typeof culture === "string") {
    const parts = culture.split("-");
    if (parts.length === 2) {
      return parts[0] as Language;
    }
  }
  return undefined;
}
