/**
 * Utility functions for culture string manipulation
 */

/**
 * Extracts the language code from a culture string
 * @param culture Culture string in format "language-country" (e.g., "en-us", "es-mx")
 * @returns Language code (e.g., "en", "es") or undefined if culture is falsy
 */
export function getLanguageFromCulture(culture?: string): string | undefined {
  if (!culture) return undefined;
  return culture.split('-')[0];
}

/**
 * Extracts both language and country from a culture string
 * @param culture Culture string in format "language-country" (e.g., "en-us", "es-mx")
 * @returns Object with language and country properties, or undefined if culture is falsy
 */
export function parseCulture(culture?: string): { language: string; country: string } | undefined {
  if (!culture) return undefined;
  const [language, country] = culture.split('-');
  return { language, country };
}