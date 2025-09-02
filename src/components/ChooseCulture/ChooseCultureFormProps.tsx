import type { Dispatch } from "react";
import type { Action } from "../../reducers/appReducer";
import type { CultureInfo } from "@idahoedokpayi/react-country-state-selector";
export interface ChooseCultureFormProps {
  cultureInfo?: CultureInfo;
  dispatch: Dispatch<Action>;
}
