// Removed unused useReducer import
import { type FC } from "react";
import { useDomainRegistrationLogic } from "../../hooks/useDomainRegistrationLogic";
import { ContactInfoForm } from "./ContactInfoForm";
import { DomainInput } from "./DomainInput";
import "./DomainRegistration.css";
import type { DomainRegistrationProps } from "./DomainRegistrationProps";
import CircularProgress from "@mui/material/CircularProgress";
import { DomainRegistrationsList } from "../DomainRegistrationsList";

export const DomainRegistration: FC<DomainRegistrationProps> = ({ state, dispatch }: DomainRegistrationProps) => {
    const { domainRegistrations } = state
    const {
        cityRef,
        isValid,
        handleContactChange,
        handleSubmit,
        handleDomainInputChange,
        domainRegistrationText,
        domainInputValue,
        domainError,
        loading,
        domainRegistrationsListText,
        APICallFailed
    } = useDomainRegistrationLogic(state, dispatch);

    return !loading ? (
        <div>
            <h1>{domainRegistrationText?.title}</h1>
            <p>{domainRegistrationText?.subtitle}</p>
            {
                (APICallFailed && !!(domainRegistrations) && domainRegistrations.length > 0) ? null : <DomainRegistrationsList domainRegistrationData={domainRegistrations || []} localizedText={domainRegistrationsListText} onClickSelect={(domainReg) => { dispatch({ type: "SELECT_DOMAIN_REGISTRATION", payload: domainReg }) }} />
            }
            <form onSubmit={handleSubmit}></form>
            <div>
                <form onSubmit={handleSubmit}>
                    <DomainInput
                        value={domainInputValue}
                        error={domainError}
                        isValid={!!isValid}
                        onChange={handleDomainInputChange}
                    />
                    <ContactInfoForm
                        cityRef={cityRef}
                        state={state}
                        onChange={handleContactChange}
                        dispatch={dispatch}
                    />
                    <button type="submit" className="app-btn">{domainRegistrationText.submit}</button>
                </form>
            </div>
        </div>
    ) : (<CircularProgress />)
};