import { useEffect, useRef } from "react";
import { domainRegex } from "../../services/domainRegex";
import { domainValidate } from "../../services/domainValidate";
import { validateDomainWhois } from "../../services/validateDomainWhois";
import { validateEmail } from "../../services/validateEmail";
import { validatePhone } from "../../services/validatePhone";
import type { Dispatch } from "react";
import type { Action } from "../../reducers/appReducer";
import type { State } from "../../types/State";

export function useDomainRegistrationLogic(state: State, dispatch: Dispatch<Action>) {
  const COUNTDOWN_SECONDS = Number(import.meta.env.VITE_COUNTDOWN_SECONDS) || 10;
  const countdownRef = useRef<HTMLDivElement>(null);
  const cityRef = useRef<HTMLInputElement>(null);
  const stateRef = useRef<HTMLInputElement | HTMLSelectElement>(null);

  // move this code into COuntDownIndicator
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
      dispatch({ type: 'SET_UI_STATE', payload: 'authorPage' });
    }
  }, [state.showRedirect, state.countdown, dispatch]);

  const contactInfo = (state.domainRegistration ? state.domainRegistration.contactInformation : undefined) || {
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

  function handleContactChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    dispatch({
      type: "UPDATE_DOMAIN_CONTACT_INFO",
      payload: {
        ...contactInfo,
        [name]: value,
      },
    });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const value = domainInputValue.trim();
    dispatch({ type: "UPDATE_DOMAIN_INPUT_VALUE", payload: value });
    if (value === '') {
      dispatch({ type: "UPDATE_DOMAIN_ERROR", payload: null });
      dispatch({ type: "UPDATE_DOMAIN", payload: { topLevelDomain: '', secondLevelDomain: '' } });
      return;
    } else if (!domainValidate(value)) {
      dispatch({ type: "UPDATE_DOMAIN_ERROR", payload: 'Please enter a valid domain (e.g., example.com)' });
      dispatch({ type: "UPDATE_DOMAIN", payload: { topLevelDomain: '', secondLevelDomain: '' } });
      return;
    } else if (!(await validateDomainWhois(value))) {
      dispatch({ type: "UPDATE_DOMAIN_ERROR", payload: 'Domain already exists. Please choose another.' });
      dispatch({ type: "UPDATE_DOMAIN", payload: { topLevelDomain: '', secondLevelDomain: '' } });
      return;
    }
    const requiredFields = [
      contactInfo.firstName,
      contactInfo.lastName,
      contactInfo.address,
      contactInfo.city,
      contactInfo.state,
      contactInfo.zipCode,
      contactInfo.emailAddress,
      contactInfo.telephoneNumber
    ];
    if (requiredFields.some(f => !f || f.trim() === '')) {
      dispatch({ type: "UPDATE_DOMAIN_ERROR", payload: 'Please fill out all required contact information.' });
      return;
    }
    if (!validateEmail(contactInfo.emailAddress ?? "")) {
      dispatch({ type: "UPDATE_DOMAIN_ERROR", payload: 'Please enter a valid email address.' });
      return;
    }
    if (!validatePhone(contactInfo.telephoneNumber ?? "")) {
      dispatch({ type: "UPDATE_DOMAIN_ERROR", payload: 'Please enter a valid telephone number.' });
      return;
    }
    const match = value.match(domainRegex);
    if (match) {
      dispatch({ type: "UPDATE_DOMAIN_ERROR", payload: null });
      dispatch({ type: "UPDATE_DOMAIN", payload: { secondLevelDomain: match[1], topLevelDomain: match[2] } });
      dispatch({ type: "UPDATE_DOMAIN_CONTACT_INFO", payload: { ...contactInfo } });
      dispatch({ type: 'UPDATE_STATE', payload: { showRedirect: true, countdown: COUNTDOWN_SECONDS } });
    } else {
      dispatch({ type: "UPDATE_DOMAIN_ERROR", payload: 'Please enter a valid domain (e.g., example.com)' });
      dispatch({ type: "UPDATE_DOMAIN", payload: { topLevelDomain: '', secondLevelDomain: '' } });
    }
  }

  return {
    COUNTDOWN_SECONDS,
    countdownRef,
    cityRef,
    stateRef,
    contactInfo,
    domainInputValue,
    domainError,
    isValid,
    handleContactChange,
    handleSubmit,
  };
}
