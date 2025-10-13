import { useContext } from "react";
import { LocalizationContext } from "../LocalizationContext";
import { getDefaultLocale } from "../services/getDefaultLocale";

export const useLocalizationContext = () => {
  const localizationData = useContext(LocalizationContext);
  return localizationData || getDefaultLocale();
};