import { CountdownIndicator } from "../CountdownIndicator";
import { ContactInfoForm } from "./ContactInfoForm";
import { DomainInput } from "./DomainInput";
import "./DomainRegistration.css";
import type { DomainRegistrationProps } from "./DomainRegistrationProps";
import { useDomainRegistrationLogic } from "./domainRegistrationLogic";


export function DomainRegistration({ state, dispatch }: DomainRegistrationProps) {
    const {
        countdownRef,
        cityRef,
        domainInputValue,
        domainError,
        isValid,
        handleContactChange,
        handleSubmit,
    } = useDomainRegistrationLogic(state, dispatch);

    return (
        <div>
            <h1>Domain Registration</h1>
            <p>Register your domain and contact information.</p>
            <form onSubmit={handleSubmit}>
                <DomainInput
                    value={domainInputValue}
                    error={domainError}
                    isValid={!!isValid}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => dispatch({ type: "UPDATE_DOMAIN_INPUT_VALUE", payload: e.target.value })}
                />
                <ContactInfoForm
                    state={state}
                    cultureInfo={state.cultureInfo}
                    cityRef={cityRef as React.RefObject<HTMLInputElement>}
                    onChange={handleContactChange}
                />
                <button type="submit">Submit</button>
                <CountdownIndicator
                    showRedirect={state.showRedirect}
                    countdown={state.countdown}
                    countdownRef={countdownRef as React.RefObject<HTMLDivElement>}
                    text={`Redirecting to Author Page in ${state.countdown} seconds...`}
                />
            </form>
        </div>
    );
}
