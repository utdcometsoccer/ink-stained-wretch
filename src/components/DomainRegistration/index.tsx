import { ContactInfoForm } from "./ContactInfoForm";
import { DomainInput } from "./DomainInput";
import "./DomainRegistration.css";
import type { DomainRegistrationProps } from "./DomainRegistrationProps";
import { useDomainRegistrationLogic } from "../../hooks/useDomainRegistrationLogic";
import { useReducer, useEffect } from "react";
import { trackComponent } from "../../services/trackComponent";


export function DomainRegistration({ state, dispatch }: DomainRegistrationProps) {    
    useEffect(() => {
        trackComponent('DomainRegistration', { state });
    }, [state]);
    type LocalState = {
        domainInputValue: string;
        domainError: string | null;
    };
    const domainString = state.domainRegistration?.domain?.topLevelDomain && state.domainRegistration?.domain?.secondLevelDomain
        ? `${state.domainRegistration.domain.secondLevelDomain}.${state.domainRegistration.domain.topLevelDomain}`
        : "";   
    const initialLocalState: LocalState = {       
        domainInputValue: domainString ||"",
        domainError: null,
    };
    function reducer(state: LocalState, action: any): LocalState {
        switch (action.type) {
            case "SET_DOMAIN_INPUT_VALUE":
                return { ...state, domainInputValue: action.payload };
            case "SET_DOMAIN_ERROR":
                return { ...state, domainError: action.payload };
            default:
                return state;
        }
    }
    const [local, localDispatch] = useReducer(reducer, initialLocalState);

    const {
        cityRef,
        isValid,
        handleContactChange,
        handleSubmit: originalHandleSubmit,
        handleDomainInputChange,
    } = useDomainRegistrationLogic(state, dispatch, local.domainInputValue, local.domainError, localDispatch);

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        originalHandleSubmit(e);
        // If valid, start redirect
        if (isValid) {
            dispatch({ type: 'SET_UI_STATE', payload: 'authorPage' });
        }
    }

    return (
        <div>
            <h1>Domain Registration</h1>
            <p>Register your domain and contact information.</p>
            <form onSubmit={handleSubmit}>
                <DomainInput
                    value={local.domainInputValue}
                    error={local.domainError}
                    isValid={!!isValid}
                    onChange={handleDomainInputChange}
                />
                <ContactInfoForm
                    state={state}
                    cultureInfo={state.cultureInfo}
                    cityRef={cityRef as React.RefObject<HTMLInputElement>}
                    onChange={handleContactChange}
                />
                <button type="submit" className="app-btn">Submit</button>
            </form>
        </div>
    );
}
