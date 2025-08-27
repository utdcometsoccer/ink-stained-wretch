import { type ChangeEvent, type FormEvent, useEffect, useRef } from "react";
import "./DomainRegistration.css";
import type { DomainRegistrationProps } from "./DomainRegistrationProps";
import { domainValidate } from "../../services/domainValidate";
import { validateDomainWhois } from "../../services/validateDomainWhois";
import { domainRegex } from "../../services/domainRegex";
import { validateEmail } from "../../services/validateEmail";
import { validatePhone } from "../../services/validatePhone";
import { CountryDropdown } from "../CountryDropdown";
import { StateProvinceDropdown } from "../StateProvinceDropdown";
import { getStateProvinceOptions } from "../../services/getStateProvinceOptions";
import { extractSelectedRegion } from "../../services/extractSelectedRegion";

export function DomainRegistration({ state, dispatch }: DomainRegistrationProps) {
    const COUNTDOWN_SECONDS = Number(import.meta.env.VITE_COUNTDOWN_SECONDS) || 10;
    const countdownRef = useRef<HTMLDivElement>(null);
    const selectedRegion = extractSelectedRegion(state.domainContactInfo, state.culture);
    const stateProvinceOptions = state.stateProvinceOptions || [];
    const cityRef = useRef<HTMLInputElement>(null);
    const stateRef = useRef<HTMLInputElement | HTMLSelectElement>(null);

    useEffect(() => {
        if (countdownRef.current) {
            const percent = `${(COUNTDOWN_SECONDS - (state.countdown ?? 0)) * (100 / COUNTDOWN_SECONDS)}%`;
            countdownRef.current.style.setProperty('--countdown-width', percent);
        }
    }, [state.countdown, COUNTDOWN_SECONDS]);

    useEffect(() => {
        if (state.showRedirect && state.countdown !== null && (state.countdown ?? 0) > 0) {
            const timer = setTimeout(() => {
                dispatch({ type: 'UPDATE_STATE', payload: { countdown: (state.countdown ?? 1) - 1 } });
            }, 1000);
            return () => clearTimeout(timer);
        } else if (state.showRedirect && state.countdown === 0) {
            dispatch({ type: 'UPDATE_STATE', payload: { countdown: null } });
            dispatch({ type: 'SET_UI_STATE', payload: 'author' });
        }
    }, [state.showRedirect, state.countdown, dispatch]);
    // Local state for contact info fields
    const contactInfo = state.domainContactInfo || {
        firstName: '',
        lastName: '',
        address: '',
        address2: '',
        city: '',
        state: '',
        country: '',
        zipCode: '',
        emailAddress: '',
        telephoneNumber: '',
    };
    const domainInputValue = state.domainInputValue || '';
    const domainError = state.domainError || null;
    const isValid = domainValidate(domainInputValue) && !domainError && domainInputValue;

    const handleContactChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        // If country changes, reset state/province and city form elements directly
        if (name === "country") {
            if (cityRef.current) cityRef.current.value = "";
            if (stateRef.current) stateRef.current.value = "";
            const newRegion = value as import("../../types/Region").Region;
            const newOptions = getStateProvinceOptions(newRegion);
            dispatch({
                type: "UPDATE_DOMAIN_CONTACT_INFO",
                payload: {
                    ...contactInfo,
                    country: value,
                    state: "", // Reset state/province
                    city: "", // Reset city
                },
            });
            dispatch({
                type: "UPDATE_STATE",
                payload: {
                    stateProvinceOptions: newOptions
                }
            });
        } else {
            dispatch({
                type: "UPDATE_DOMAIN_CONTACT_INFO",
                payload: {
                    ...contactInfo,
                    [name]: value,
                },
            });
        }
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const input = form.elements.namedItem("domain") as HTMLInputElement;
        const value = input.value.trim();
        dispatch({ type: "UPDATE_DOMAIN_INPUT_VALUE", payload: value });
        // Validate domain
        if (value === '') {
            dispatch({ type: "UPDATE_DOMAIN_ERROR", payload: null });
            dispatch({
                type: "UPDATE_DOMAIN",
                payload: { topLevelDomain: '', secondLevelDomain: '' },
            });
            return;
        } else if (!domainValidate(value)) {
            dispatch({ type: "UPDATE_DOMAIN_ERROR", payload: 'Please enter a valid domain (e.g., example.com)' });
            dispatch({
                type: "UPDATE_DOMAIN",
                payload: { topLevelDomain: '', secondLevelDomain: '' },
            });
            return;
        } else if (!(await validateDomainWhois(value))) {
            dispatch({ type: "UPDATE_DOMAIN_ERROR", payload: 'Domain already exists. Please choose another.' });
            dispatch({
                type: "UPDATE_DOMAIN",
                payload: { topLevelDomain: '', secondLevelDomain: '' },
            });
            return;
        }

        // Get contact info from form fields
        const firstName = (form.elements.namedItem("firstName") as HTMLInputElement)?.value.trim();
        const lastName = (form.elements.namedItem("lastName") as HTMLInputElement)?.value.trim();
        const address = (form.elements.namedItem("address") as HTMLInputElement)?.value.trim();
        const address2 = (form.elements.namedItem("address2") as HTMLInputElement)?.value.trim();
        const city = (form.elements.namedItem("city") as HTMLInputElement)?.value.trim();
        const stateVal = (form.elements.namedItem("state") as HTMLInputElement)?.value.trim();
        const country = (form.elements.namedItem("country") as HTMLInputElement)?.value.trim();
        const zipCode = (form.elements.namedItem("zipCode") as HTMLInputElement)?.value.trim();
        const emailAddress = (form.elements.namedItem("emailAddress") as HTMLInputElement)?.value.trim();
        const telephoneNumber = (form.elements.namedItem("telephoneNumber") as HTMLInputElement)?.value.trim();

        // Validate contact info
        const requiredFields = [firstName, lastName, address, city, stateVal, zipCode, emailAddress, telephoneNumber];
        if (requiredFields.some(f => !f || f.trim() === '')) {
            dispatch({ type: "UPDATE_DOMAIN_ERROR", payload: 'Please fill out all required contact information.' });
            return;
        }

        // Email validation
        if (!validateEmail(emailAddress)) {
            dispatch({ type: "UPDATE_DOMAIN_ERROR", payload: 'Please enter a valid email address.' });
            return;
        }

        // Telephone validation
        if (!validatePhone(telephoneNumber)) {
            dispatch({ type: "UPDATE_DOMAIN_ERROR", payload: 'Please enter a valid telephone number.' });
            return;
        }

        const match = value.match(domainRegex);
        if (match) {
            dispatch({ type: "UPDATE_DOMAIN_ERROR", payload: null });
            dispatch({
                type: "UPDATE_DOMAIN",
                payload: {
                    secondLevelDomain: match[1],
                    topLevelDomain: match[2],
                },
            });
            dispatch({
                type: "UPDATE_DOMAIN_CONTACT_INFO",
                payload: {
                    firstName,
                    lastName,
                    address,
                    address2,
                    city,
                    state: stateVal,
                    country,
                    zipCode,
                    emailAddress,
                    telephoneNumber,
                },
            });
            dispatch({ type: 'UPDATE_STATE', payload: { showRedirect: true, countdown: COUNTDOWN_SECONDS } });
        } else {
            dispatch({ type: "UPDATE_DOMAIN_ERROR", payload: 'Please enter a valid domain (e.g., example.com)' });
            dispatch({
                type: "UPDATE_DOMAIN",
                payload: { topLevelDomain: '', secondLevelDomain: '' },
            });
        }
    };

    return (
        <div>
            <h1>Domain Registration</h1>
            <p>Register your domain and contact information.</p>
            <form onSubmit={handleSubmit}>
                <label>
                    Domain:
                    <input
                        type="text"
                        name="domain"
                        value={domainInputValue}
                        onChange={e => dispatch({ type: "UPDATE_DOMAIN_INPUT_VALUE", payload: e.target.value })}
                        placeholder="example.com"
                        required
                        className={
                            domainError
                                ? "domain-input-error"
                                : isValid
                                    ? "domain-input-success"
                                    : undefined
                        }
                    />
                </label>
                {domainError && (
                    <div className="error-message">{domainError}</div>
                )}
                {!domainError && isValid && (
                    <div className="domain-success-message">Domain format is valid and available!</div>
                )}
                <fieldset className="domain-contact-fieldset">
                    <legend>Contact Information</legend>
                    <label>
                        First Name:
                        <input
                            type="text"
                            name="firstName"
                            defaultValue={contactInfo.firstName}
                            onChange={handleContactChange}
                            required
                        />
                    </label>
                    <br />
                    <label>
                        Last Name:
                        <input
                            type="text"
                            name="lastName"
                            defaultValue={contactInfo.lastName}
                            onChange={handleContactChange}
                            required
                        />
                    </label>
                    <br />
                    <label>
                        Address:
                        <input
                            type="text"
                            name="address"
                            defaultValue={contactInfo.address}
                            onChange={handleContactChange}
                            required
                        />
                    </label>
                    <br />
                    <label>
                        Address 2:
                        <input
                            type="text"
                            name="address2"
                            defaultValue={contactInfo.address2 || ''}
                            onChange={handleContactChange}
                        />
                    </label>
                    <br />
                    <label>
                        City:
                        <input
                            type="text"
                            name="city"
                            defaultValue={contactInfo.city}
                            onChange={handleContactChange}
                            required
                            ref={cityRef}
                        />
                    </label>
                    <br />
                    <label>
                        State / Province:
                        <StateProvinceDropdown
                            key={contactInfo.country}
                            options={stateProvinceOptions}
                            value={contactInfo.state}
                            onChange={handleContactChange}
                            onTextChange={handleContactChange}
                            required={true}
                            name="state"
                            inputRef={stateRef}
                        />
                    </label>
                    <br />
                    <label>
                        Country:
                        <CountryDropdown
                            region={selectedRegion}
                            defaultValue={contactInfo.country}
                            onChange={handleContactChange}
                            required={false}
                        />
                    </label>
                    <br />
                    <label>
                        Zip Code:
                        <input
                            type="text"
                            name="zipCode"
                            defaultValue={contactInfo.zipCode}
                            onChange={handleContactChange}
                            required
                        />
                    </label>
                    <br />
                    <label>
                        Email Address:
                        <input
                            type="email"
                            name="emailAddress"
                            defaultValue={contactInfo.emailAddress}
                            onChange={handleContactChange}
                            required
                        />
                    </label>
                    <br />
                    <label>
                        Telephone Number:
                        <input
                            type="tel"
                            name="telephoneNumber"
                            defaultValue={contactInfo.telephoneNumber}
                            onChange={handleContactChange}
                            required
                        />
                    </label>
                </fieldset>
                <button type="submit">Submit</button>
                {state.showRedirect && state.countdown !== null && (state.countdown ?? 0) > 0 && (
                    <div
                        className="countdown-indicator"
                        ref={countdownRef}
                    >
                        <div className="countdown-text">
                            Redirecting to Author Page in {state.countdown} seconds...
                        </div>
                        <div className="countdown-bar-bg">
                            <div className="countdown-bar-fill" />
                        </div>
                    </div>
                )}
            </form>
        </div>
    );
}
