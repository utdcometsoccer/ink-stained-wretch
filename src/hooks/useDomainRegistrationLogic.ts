import { useRef, useReducer } from "react";
import { domainRegex } from "../services/domainRegex";
import { domainValidate } from "../services/domainValidate";
import { validateDomainWhois } from "../services/validateDomainWhois";
import { validateEmail } from "../services/validateEmail";
import { validatePhone } from "../services/validatePhone";
import type { Dispatch } from "react";
import type { Action } from "../types/Action";
import type { State } from "../types/State";
import type { DomainRegistrationLogicReturn } from "../types/DomainRegistrationLogicReturn";
import { parseDomain } from "../services/parseDomain";
import { useGetLocalizedText } from "./useGetLocalizedText";

export function useDomainRegistrationLogic(state: State, dispatch: Dispatch<Action>): DomainRegistrationLogicReturn {

  const culture = state.cultureInfo?.Culture || 'en-us';
  const domainRegistrationText = useGetLocalizedText(culture)?.DomainRegistration || {
        title: "Domain Registration",
        subtitle: "Register your domain and contact information.",
        submit: "Submit",
        firstName: "First Name",
        lastName: "Last Name",
        address: "Address",
        address2: "Address 2",
        city: "City",
        state: "State / Province:",
        country: "Country:",
        zipCode: "Zip Code",
        emailAddress: "Email Address",
        telephoneNumber: "Telephone Number"
    };
  useTrackComponent('DomainRegistration', { state, dispatch, culture });
  const { domainRegistration } = state;
  const { domain } = domainRegistration || {};
  const { topLevelDomain, secondLevelDomain } = domain || {};
  const domainString = secondLevelDomain && topLevelDomain
    ? `${secondLevelDomain}.${topLevelDomain}`
    : "";
  type LocalState = { domainInputValue: string; domainError: string | null };
  type LocalAction = { type: "SET_DOMAIN_INPUT_VALUE"; payload: string } | { type: "SET_DOMAIN_ERROR"; payload: string | null };
  const localReducer = (localState: LocalState, action: LocalAction): LocalState => {
    switch (action.type) {
      case "SET_DOMAIN_INPUT_VALUE":
        return { ...localState, domainInputValue: action.payload };
      case "SET_DOMAIN_ERROR":
        return { ...localState, domainError: action.payload };
      default:
        return localState;
    }
  };
  const [localState, localDispatch] = useReducer(localReducer, {
    domainInputValue: domainString || "",
    domainError: null
  });
  const domainInputValue = localState.domainInputValue;
  const domainError = localState.domainError;
  const cityRef = useRef<HTMLInputElement>(null);
  const stateRef = useRef<HTMLInputElement | HTMLSelectElement>(null);
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
  // domainInputValue and domainError are now passed as arguments
  const isValid = !!(domainValidate(domainInputValue) && !domainError && domainInputValue);

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

  function handleDomainInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    localDispatch({ type: "SET_DOMAIN_INPUT_VALUE", payload: e.target.value });
    const { secondLevelDomain, topLevelDomain } = parseDomain(e.target.value);
    dispatch({
      type: "SET_DOMAIN_INPUT_VALUE", payload: {
        topLevelDomain,
        secondLevelDomain
      }
    });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const value = domainInputValue.trim();
    const { secondLevelDomain, topLevelDomain } = parseDomain(domainInputValue);
    dispatch({
      type: "SET_DOMAIN_INPUT_VALUE", payload: value
    });
    if (value === '') {
      localDispatch({ type: "SET_DOMAIN_ERROR", payload: null });
      dispatch({ type: "UPDATE_DOMAIN", payload: { topLevelDomain: '', secondLevelDomain: '' } });
      return;
    } else if (!domainValidate(value)) {
      localDispatch({ type: "SET_DOMAIN_ERROR", payload: 'Please enter a valid domain (e.g., example.com)' });
      dispatch({ type: "UPDATE_DOMAIN", payload: { topLevelDomain: '', secondLevelDomain: '' } });
      return;
    } else if (!(await validateDomainWhois(value))) {
      localDispatch({ type: "SET_DOMAIN_ERROR", payload: 'Domain already exists. Please choose another.' });
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
      localDispatch({ type: "SET_DOMAIN_ERROR", payload: 'Please fill out all required contact information.' });
      return;
    }
    if (!validateEmail(contactInfo.emailAddress ?? "")) {
      localDispatch({ type: "SET_DOMAIN_ERROR", payload: 'Please enter a valid email address.' });
      return;
    }
    if (!validatePhone(contactInfo.telephoneNumber ?? "")) {
      localDispatch({ type: "SET_DOMAIN_ERROR", payload: 'Please enter a valid telephone number.' });
      return;
    }
    const match = value.match(domainRegex);
    if (match) {
      localDispatch({ type: "SET_DOMAIN_ERROR", payload: null });
      dispatch({ type: "UPDATE_DOMAIN", payload: { secondLevelDomain: secondLevelDomain, topLevelDomain: topLevelDomain } });
      dispatch({ type: "UPDATE_DOMAIN_CONTACT_INFO", payload: { ...contactInfo } });
      dispatch({ type: 'SET_UI_STATE', payload: 'authorPage' });
    } else {
      localDispatch({ type: "SET_DOMAIN_ERROR", payload: 'Please enter a valid domain (e.g., example.com)' });
      dispatch({ type: "UPDATE_DOMAIN", payload: { topLevelDomain: '', secondLevelDomain: '' } });
    }
  }

  return {
    cityRef,
    stateRef,
    isValid,
    handleContactChange,
    handleSubmit,
    handleDomainInputChange,
    domainRegistrationText,
    domainInputValue,
    domainError,
    culture
  };
}
