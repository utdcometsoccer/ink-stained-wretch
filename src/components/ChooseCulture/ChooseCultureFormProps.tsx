import type { Dispatch } from "react";
import type { LoginAction } from "../../types/LoginAction";

export interface ChooseCultureFormProps {
  culture: string;
  selectedLanguage?: string;
  selectedRegion?: string;
  dispatch: Dispatch<LoginAction>;
}
