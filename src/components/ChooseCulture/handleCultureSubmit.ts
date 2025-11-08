import type { Dispatch } from "react";
import type { Action } from "../../types/Action";
import type { CultureInfo } from "@idahoedokpayi/react-country-state-selector";

export function handleCultureSubmit(
    dispatch: Dispatch<Action>,
    cultureInfo?: CultureInfo    
) {
    dispatch({ type: 'UPDATE_STATE', payload: { cultureInfo } });
    dispatch({ type: 'SET_UI_STATE', payload: 'domainRegistration' });
} 