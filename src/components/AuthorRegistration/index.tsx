import { type ChangeEvent, type FormEvent, useRef, useEffect } from "react";
//import "./AuthorRegistration.css";
import { validateEmail } from "../../services/validateEmail";
import { validatePhone } from "../../services/validatePhone";
import { LanguageDropdown } from "../LanguageDropdown";
import { RegionDropdown } from "../RegionDropdown";
import type { AuthorRegistrationProps } from "./AuthorRegistrationProps";

export function AuthorRegistration({ state, dispatch }: AuthorRegistrationProps) {
    const COUNTDOWN_SECONDS = Number(import.meta.env.VITE_COUNTDOWN_SECONDS) || 10;
    const countdownRef = useRef<HTMLDivElement>(null);

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

    // Local state for author info fields
    const authorInfo = state.authorInfo || {
        firstName: '',
        lastName: '',
        penName: '',
        emailAddress: '',
        telephoneNumber: '',
        language: '',
        region: '',
    };

    const authorError = state.authorError || null;

    const handleAuthorChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        dispatch({
            type: "UPDATE_AUTHOR_INFO",
            payload: {
                ...authorInfo,
                [name]: value,
            },
        });
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const firstName = (form.elements.namedItem("firstName") as HTMLInputElement)?.value.trim();
        const lastName = (form.elements.namedItem("lastName") as HTMLInputElement)?.value.trim();
        const penName = (form.elements.namedItem("penName") as HTMLInputElement)?.value.trim();
        const emailAddress = (form.elements.namedItem("emailAddress") as HTMLInputElement)?.value.trim();
        const telephoneNumber = (form.elements.namedItem("telephoneNumber") as HTMLInputElement)?.value.trim();
        const language = (form.elements.namedItem("language") as HTMLSelectElement)?.value;
        const region = (form.elements.namedItem("region") as HTMLSelectElement)?.value;

        // Validate required fields
        const requiredFields = [firstName, lastName, penName, emailAddress, telephoneNumber, language, region];
        if (requiredFields.some(f => !f || f.trim() === '')) {
            dispatch({ type: "UPDATE_AUTHOR_ERROR", payload: 'Please fill out all required author information.' });
            return;
        }

        // Email validation
        if (!validateEmail(emailAddress)) {
            dispatch({ type: "UPDATE_AUTHOR_ERROR", payload: 'Please enter a valid email address.' });
            return;
        }

        // Telephone validation
        if (!validatePhone(telephoneNumber)) {
            dispatch({ type: "UPDATE_AUTHOR_ERROR", payload: 'Please enter a valid telephone number.' });
            return;
        }

        dispatch({ type: "UPDATE_AUTHOR_ERROR", payload: null });
        dispatch({
            type: "UPDATE_AUTHOR_INFO",
            payload: {
                firstName,
                lastName,
                penName,
                emailAddress,
                telephoneNumber,
                language,
                region,
            },
        });
        dispatch({ type: 'UPDATE_STATE', payload: { showRedirect: true, countdown: COUNTDOWN_SECONDS } });
    };

    return (
        <div>
            <h1>Author Registration</h1>
            <p>Enter your author information.</p>
            <form onSubmit={handleSubmit}>
                <fieldset className="author-fieldset">
                    <legend>Author Information</legend>
                    <label>
                        First Name:
                        <input
                            type="text"
                            name="firstName"
                            defaultValue={authorInfo.firstName}
                            onChange={handleAuthorChange}
                            required
                        />
                    </label>
                    <br />
                    <label>
                        Last Name:
                        <input
                            type="text"
                            name="lastName"
                            defaultValue={authorInfo.lastName}
                            onChange={handleAuthorChange}
                            required
                        />
                    </label>
                    <br />
                    <label>
                        Pen Name:
                        <input
                            type="text"
                            name="penName"
                            defaultValue={authorInfo.penName}
                            onChange={handleAuthorChange}
                            required
                        />
                    </label>
                    <br />
                    <label>
                        Email Address:
                        <input
                            type="email"
                            name="emailAddress"
                            defaultValue={authorInfo.emailAddress}
                            onChange={handleAuthorChange}
                            required
                        />
                    </label>
                    <br />
                    <label>
                        Telephone Number:
                        <input
                            type="tel"
                            name="telephoneNumber"
                            defaultValue={authorInfo.telephoneNumber}
                            onChange={handleAuthorChange}
                            required
                        />
                    </label>
                    <br />
                    <LanguageDropdown
                        name="language"
                        defaultValue={authorInfo.language || state.culture?.language || ""}
                        onChange={handleAuthorChange}
                        required
                    />
                    <br />
                    <label>
                        Region:
                        <RegionDropdown
                            name="region"
                            defaultValue={authorInfo.region || state.culture?.region || ""}
                            onChange={handleAuthorChange}
                            required
                        />
                    </label>
                </fieldset>
                {authorError && (
                    <div className="error-message">{authorError}</div>
                )}
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
