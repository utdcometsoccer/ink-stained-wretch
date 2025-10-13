import { cultureFromBrowser } from '@idahoedokpayi/react-country-state-selector';
import type { Culture } from '../types/Culture';

/**
 * Gets the current culture from the browser and returns a default culture 
 * from environment variable if the browser culture is not correctly formatted.
 * 
 * ## Culture Format
 * The expected culture format is: `language-country` (e.g., 'en-us', 'es-mx', 'fr-ca')
 * - Language: 2+ character language code (lowercase)
 * - Country: 2+ character country code (uppercase in input, lowercase in output)
 * - All output cultures are normalized to lowercase
 * 
 * ## Environment Variables (checked in order of priority)
 * 1. **VITE_DEFAULT_CULTURE** - Full culture string (e.g., 'en-us', 'es-MX')
 *    - Must contain a hyphen separating language and country
 *    - Invalid formats are ignored and fall through to next option
 * 2. **VITE_DEFAULT_LANGUAGE** - Language code only (e.g., 'fr', 'es')
 *    - Automatically appends '-us' as the country
 *    - Must be 2+ characters
 * 3. **Ultimate Fallback** - Returns 'en-us' if all else fails
 * 
 * ## Usage Examples
 * ```typescript
 * // Basic usage
 * const culture = getBrowserCultureWithFallback();
 * console.log(culture); // { Language: 'en', Country: 'US', Culture: 'en-us' }
 * 
 * // With environment variables
 * // VITE_DEFAULT_CULTURE=es-MX
 * const culture = getBrowserCultureWithFallback();
 * console.log(culture); // { Language: 'es', Country: 'MX', Culture: 'es-mx' }
 * ```
 * 
 * ## Validation
 * Browser culture is considered invalid if:
 * - Language or Country properties are missing
 * - Language or Country are shorter than 2 characters
 * - cultureFromBrowser() throws an error or returns null/undefined
 * 
 * @returns {object} Culture object with Language, Country, and Culture properties
 */
export function getBrowserCultureWithFallback(): {
  Language: string;
  Country: string; 
  Culture: Culture;
} {
  try {
    // Try to get culture from browser
    const browserCulture = cultureFromBrowser();
    
    // Validate that we have the required properties
    if (browserCulture && 
        browserCulture.Language && 
        browserCulture.Country && 
        typeof browserCulture.Language === 'string' && 
        typeof browserCulture.Country === 'string' &&
        browserCulture.Language.length >= 2 &&
        browserCulture.Country.length >= 2) {
      
      // Create properly formatted culture string (lowercase)
      const culture = `${browserCulture.Language}-${browserCulture.Country}`.toLowerCase() as Culture;
      
      return {
        Language: browserCulture.Language,
        Country: browserCulture.Country,
        Culture: culture
      };
    }
  } catch (error) {
    // If browser culture detection fails, fall through to default
    console.warn('Failed to detect browser culture:', error);
  }

  // Fall back to environment variable or default
  const defaultCulture = getDefaultCulture();
  const [language, country] = defaultCulture.split('-');
  
  return {
    Language: language,
    Country: country.toUpperCase(),
    Culture: defaultCulture
  };
}

/**
 * Gets the default culture from environment variables with fallbacks
 * @returns {Culture} Default culture string in lowercase format
 */
function getDefaultCulture(): Culture {
  // Check for full culture string first
  const envCulture = import.meta.env.VITE_DEFAULT_CULTURE;
  if (envCulture && typeof envCulture === 'string' && envCulture.includes('-')) {
    const culture = envCulture.toLowerCase();
    if (isValidCultureFormat(culture)) {
      return culture as Culture;
    }
  }

  // Check for language-only setting (default to US)
  const envLanguage = import.meta.env.VITE_DEFAULT_LANGUAGE;
  if (envLanguage && typeof envLanguage === 'string' && envLanguage.length >= 2) {
    const culture = `${envLanguage.toLowerCase()}-us`;
    if (isValidCultureFormat(culture)) {
      return culture as Culture;
    }
  }

  // Ultimate fallback
  return 'en-us' as Culture;
}

/**
 * Validates that a culture string follows the expected format
 * @param culture - Culture string to validate
 * @returns {boolean} True if valid format
 */
function isValidCultureFormat(culture: string): boolean {
  // Basic format check: language-country with at least 2 chars each
  const parts = culture.split('-');
  return parts.length === 2 && 
         parts[0].length >= 2 && 
         parts[1].length >= 2 &&
         /^[a-z]+$/.test(parts[0]) && 
         /^[a-z]+$/.test(parts[1]);
}