import type React from "react";
import type { State } from "../../types/State";
import type { CultureInfo } from "@idahoedokpayi/react-country-state-selector";


export interface ContactInfoFormProps {
    state: State;
    cultureInfo?: CultureInfo;
    cityRef: React.RefObject<HTMLInputElement>;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}
