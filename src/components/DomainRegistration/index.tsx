// Removed unused useReducer import
import { type FC } from "react";
import { useDomainRegistrationLogic } from "../../hooks/useDomainRegistrationLogic";
import { ContactInfoForm } from "./ContactInfoForm";
import { DomainInput } from "./DomainInput";
import "./DomainRegistration.css";
import type { DomainRegistrationProps } from "./DomainRegistrationProps";

export const DomainRegistration:FC<DomainRegistrationProps> =({ state, dispatch }: DomainRegistrationProps)=> {
    
    const {
        cityRef,
        isValid,
        handleContactChange,
        handleSubmit,
        handleDomainInputChange,
        domainRegistrationText,
        domainInputValue,
        domainError,
        culture
    } = useDomainRegistrationLogic(state, dispatch);

    return (
        <div>
            <h1>{domainRegistrationText.title}</h1>
            <p>{domainRegistrationText.subtitle}</p>
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
                <button type="submit" className="app-btn">{domainRegistrationText.submit}</button>
            </form>
        </div>
    );
}
