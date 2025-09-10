// Removed unused useReducer import
import { useState, type FC } from "react";
import { useDomainRegistrationLogic } from "../../hooks/useDomainRegistrationLogic";
import { useGetLocalizedText } from "../../hooks/useGetLocalizedText";
import { useTrackComponent } from "../../hooks/useTrackComponent";
import { ContactInfoForm } from "./ContactInfoForm";
import { DomainInput } from "./DomainInput";
import "./DomainRegistration.css";
import type { DomainRegistrationProps } from "./DomainRegistrationProps";



export const DomainRegistration:FC<DomainRegistrationProps> =({ state, dispatch }: DomainRegistrationProps)=> {
    const culture = state.cultureInfo?.Culture || 'en-us';
    const localized = useGetLocalizedText(culture)?.DomainRegistration;
    useTrackComponent('DomainRegistration', { state, dispatch, culture });
    const { domainRegistration } = state;
    const { domain } = domainRegistration || {};
    const { topLevelDomain, secondLevelDomain } = domain || {};
    const domainString = secondLevelDomain && topLevelDomain
        ? `${secondLevelDomain}.${topLevelDomain}`
        : "";
    const [domainInputValue, setDomainInputValue] = useState(domainString || "");
    const [domainError, setDomainError] = useState<string | null>(null);
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
