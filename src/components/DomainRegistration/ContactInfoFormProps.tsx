import type React from "react";
import type { State } from "../../types/State";
import type { CultureInfo } from "@idahoedokpayi/react-country-state-selector";
import type { Dispatch } from "react";
import type { Action } from "../../types/Action";


export interface ContactInfoFormProps {
    cityRef: React.RefObject<HTMLInputElement|null>;
    state: State;
    cultureInfo?: CultureInfo;    
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    culture?: string;
    dispatch?: Dispatch<Action>;
}
