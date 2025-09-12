import type { LocalizedText } from "../types/LocalizedText";
import enUSLocale from "../locales/inkstainedwretch.en-us.json";

export function getDefaultLocale(): LocalizedText {
  // The JSON file is already structured as LocalizedText
  return enUSLocale as LocalizedText;
}
