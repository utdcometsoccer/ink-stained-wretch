import { ContactInfoForm } from "./ContactInfoForm";
import { DomainInput } from "./DomainInput";
import "./DomainRegistration.css";
import type { DomainRegistrationProps } from "./DomainRegistrationProps";
import { useDomainRegistrationLogic } from "./domainRegistrationLogic";
import { useReducer, useEffect } from "react";


export function DomainRegistration({ state, dispatch }: DomainRegistrationProps) {
    const COUNTDOWN_SECONDS = Number(import.meta.env.VITE_COUNTDOWN_SECONDS) || 10;
    type LocalState = {
        countdown: number | null;
        showRedirect: boolean;
        domainInputValue: string;
        domainError: string | null;
    };
    const initialLocalState: LocalState = {
        countdown: null,
        showRedirect: false,
        domainInputValue: "",
        domainError: null,
    };
    function reducer(state: LocalState, action: any): LocalState {
        switch (action.type) {
            case "START_REDIRECT":
                return { ...state, showRedirect: true, countdown: COUNTDOWN_SECONDS };
            case "STOP_REDIRECT":
                return { ...state, showRedirect: false, countdown: null };
            case "TICK":
                return { ...state, countdown: (state.countdown ?? 1) - 1 };
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
    } = useDomainRegistrationLogic(state, dispatch, local.domainInputValue, local.domainError);

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        originalHandleSubmit(e);
        // If valid, start redirect
        if (isValid) {
            localDispatch({ type: "START_REDIRECT" });
        }
    }

    useEffect(() => {
        if (local.showRedirect && local.countdown !== null && local.countdown > 0) {
            const timer = setTimeout(() => {
                localDispatch({ type: "TICK" });
            }, 1000);
            return () => clearTimeout(timer);
        } else if (local.showRedirect && local.countdown === 0) {
            localDispatch({ type: "STOP_REDIRECT" });
            dispatch({ type: 'SET_UI_STATE', payload: 'authorPage' });
        }
    }, [local.showRedirect, local.countdown, dispatch]);

    return (
        <div>
            <h1>Domain Registration</h1>
            <p>Register your domain and contact information.</p>
            <form onSubmit={handleSubmit}>
                <DomainInput
                    value={local.domainInputValue}
                    error={local.domainError}
                    isValid={!!isValid}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => localDispatch({ type: "SET_DOMAIN_INPUT_VALUE", payload: e.target.value })}
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
