// Removed unused useReducer import
import React from "react";
import { useDomainRegistrationLogic } from "../../hooks/useDomainRegistrationLogic";
import { useGetLocalizedText } from "../../hooks/useGetLocalizedText";
import { useTrackComponent } from "../../hooks/useTrackComponent";
import { ContactInfoForm } from "./ContactInfoForm";
import { DomainInput } from "./DomainInput";
import "./DomainRegistration.css";
import type { DomainRegistrationProps } from "./DomainRegistrationProps";



export function DomainRegistration({ state, dispatch }: DomainRegistrationProps) {
    const culture = state.cultureInfo?.Culture || 'en-us';
    const localized = useGetLocalizedText(culture)?.DomainRegistration;
    useTrackComponent('DomainRegistration', { state, dispatch, culture });

    const domainString = state.domainRegistration?.domain?.topLevelDomain && state.domainRegistration?.domain?.secondLevelDomain
        ? `${state.domainRegistration.domain.secondLevelDomain}.${state.domainRegistration.domain.topLevelDomain}`
        : "";
    const [domainInputValue, setDomainInputValue] = React.useState(domainString || "");
    const [domainError, setDomainError] = React.useState<string | null>(null);
    // Local dispatch for compatibility with hook
    const localDispatch = (action: { type: string; payload: any }) => {
        switch (action.type) {
            case "SET_DOMAIN_INPUT_VALUE":
                setDomainInputValue(action.payload);
                break;
            case "SET_DOMAIN_ERROR":
                setDomainError(action.payload);
                break;
            default:
                break;
        }
    };
    const {
        cityRef,
        isValid,
        handleContactChange,
        handleSubmit,
        handleDomainInputChange,
    } = useDomainRegistrationLogic(state, dispatch, domainInputValue, domainError, localDispatch);

    return (
        <div>
            <h1>{localized?.title ?? 'Domain Registration'}</h1>
            <p>{localized?.subtitle ?? 'Register your domain and contact information.'}</p>
            <form onSubmit={handleSubmit}>
                <DomainInput
                    value={domainInputValue}
                    error={domainError}
                    isValid={!!isValid}
                    onChange={handleDomainInputChange}
                    culture={culture}
                />
                <ContactInfoForm
                    state={state}
                    cultureInfo={state.cultureInfo}
                    cityRef={cityRef as React.RefObject<HTMLInputElement>}
                    onChange={handleContactChange}
                    culture={culture}
                />
                <button type="submit" className="app-btn">{localized?.submit ?? 'Submit'}</button>
            </form>
        </div>
    );
}
