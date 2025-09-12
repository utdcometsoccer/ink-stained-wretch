import { useContext } from "react";
import { LocalizationContext } from "../LocalizationContext";

export const useLocalizationContext = () => useContext(LocalizationContext);