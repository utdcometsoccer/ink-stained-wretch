import { type ChangeEvent } from "react";
import "./DomainRegistration.css";
import type { DomainRegistrationProps } from "./DomainRegistrationProps";

export function DomainRegistration({ state, dispatch }: DomainRegistrationProps) {
  const domainInputValue = state.domainInputValue || '';
  const domainError = state.domainError || null;

  // Regex for domain validation and extraction
  const domainRegex = /^([a-zA-Z0-9-]{1,63})\.([a-zA-Z]{2,})$/;

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    dispatch({ type: "UPDATE_DOMAIN_INPUT_VALUE", payload: value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const value = domainInputValue.trim();
    if (value === '') {
      dispatch({ type: "UPDATE_DOMAIN_ERROR", payload: null });
      dispatch({
        type: "UPDATE_DOMAIN",
        payload: { topLevelDomain: '', secondLevelDomain: '' },
      });
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
            onChange={handleChange}
            placeholder="example.com"
            required
            pattern="^[a-zA-Z0-9-]{1,63}\.[a-zA-Z]{2,}$"
            className={domainError ? "domain-input-error" : undefined}
          />
        </label>
        {domainError && (
          <div className="error-message">{domainError}</div>
        )}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
