import { createContext } from "react";
import type { LocalizedText } from "./types/LocalizedText";
import { getDefaultLocale } from "./services/getDefaultLocale";

export const LocalizationContext = createContext<LocalizedText>(getDefaultLocale());
