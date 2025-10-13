import { createContext } from "react";
import type { LocalizedText } from "./types/LocalizedText";

export const LocalizationContext = createContext<LocalizedText | null>(null);


