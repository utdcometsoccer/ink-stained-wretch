import type { Dispatch } from "react";
import { useEffect, useReducer, useRef } from "react";
import { domainRegistrationReducer } from "../reducers/domainRegistrationReducer";
import { domainRegex } from "../services/domainRegex";
import { domainValidate } from "../services/domainValidate";
import { parseDomain } from "../services/parseDomain";
import { validateDomainWhois } from "../services/validateDomainWhois";
import { validateEmail } from "../services/validateEmail";
import { validatePhone } from "../services/validatePhone";
import type { Action } from "../types/Action";
import type { DomainRegistrationLogicReturn } from "../types/DomainRegistrationLogicReturn";
import type { DomainRegistrationsFetcher } from "../types/DomainRegistrationsFetcher";
import type { State } from "../types/State";
import { useDomainRegistrations } from "./useDomainRegistrations";
import { useLocalizationContext } from "./useLocalizationContext";
import { useTrackComponent } from "./useTrackComponent";
import { getBrowserCultureWithFallback } from "../services/getBrowserCultureWithFallback";


export function useDomainRegistrationLogic(state: State, dispatch: Dispatch<Action>, domainRegistrationsFetcher: DomainRegistrationsFetcher = useDomainRegistrations): DomainRegistrationLogicReturn {
  const { authToken, cultureInfo} = state;
  const { data, error, loading } = domainRegistrationsFetcher(authToken || '', dispatch);
  useEffect(() => {
          if (data) {
              dispatch({ type: "SET_DOMAIN_REGISTRATIONS", payload: data });
          }
      }, [data, dispatch]);
  
  const culture = cultureInfo?.Culture || getBrowserCultureWithFallback().Culture;
  const localizedText = useLocalizationContext();
  const domainRegistrationText = localizedText.DomainRegistration;
  const domainRegistrationsListText = localizedText.DomainRegistrationsList;
  useTrackComponent('DomainRegistration', { state, dispatch, culture });
  const { domainRegistration } = state;
  const { domain } = domainRegistration || {};
  const { topLevelDomain, secondLevelDomain } = domain || {};
  const domainString = secondLevelDomain && topLevelDomain
    ? `${secondLevelDomain}.${topLevelDomain}`
    : "";
  const [domainRegistrationState, domainRegistrationDispatch] = useReducer(domainRegistrationReducer, {
    domainInputValue: domainString || "",
    domainError: null,
    APICallFailed: false
  });
  const cityRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (error) {
      domainRegistrationDispatch({ type: "SET_API_CALL_FAILED", payload: true });
    }
  }, [error, domainRegistrationDispatch]);
  const { APICallFailed, domainError, domainInputValue } = domainRegistrationState;  
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
    domainRegistrationDispatch({ type: "SET_DOMAIN_INPUT_VALUE", payload: e.target.value });
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
      domainRegistrationDispatch({ type: "SET_DOMAIN_ERROR", payload: null });
      dispatch({ type: "UPDATE_DOMAIN", payload: { topLevelDomain: '', secondLevelDomain: '' } });
      return;
    } else if (!domainValidate(value)) {
      domainRegistrationDispatch({ type: "SET_DOMAIN_ERROR", payload: 'Please enter a valid domain (e.g., example.com)' });
      dispatch({ type: "UPDATE_DOMAIN", payload: { topLevelDomain: '', secondLevelDomain: '' } });
      return;
    } else if (!(await validateDomainWhois(value))) {
      domainRegistrationDispatch({ type: "SET_DOMAIN_ERROR", payload: 'Domain already exists. Please choose another.' });
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
      domainRegistrationDispatch({ type: "SET_DOMAIN_ERROR", payload: 'Please fill out all required contact information.' });
      return;
    }
    if (!validateEmail(contactInfo.emailAddress ?? "")) {
      domainRegistrationDispatch({ type: "SET_DOMAIN_ERROR", payload: 'Please enter a valid email address.' });
      return;
    }
    if (!validatePhone(contactInfo.telephoneNumber ?? "")) {
      domainRegistrationDispatch({ type: "SET_DOMAIN_ERROR", payload: 'Please enter a valid telephone number.' });
      return;
    }
    const match = value.match(domainRegex);
    if (match) {
      domainRegistrationDispatch({ type: "SET_DOMAIN_ERROR", payload: null });
      dispatch({ type: "UPDATE_DOMAIN", payload: { secondLevelDomain: secondLevelDomain, topLevelDomain: topLevelDomain } });
      dispatch({ type: "UPDATE_DOMAIN_CONTACT_INFO", payload: { ...contactInfo } });
      dispatch({ type: 'SET_UI_STATE', payload: 'authorPage' });
    } else {
      domainRegistrationDispatch({ type: "SET_DOMAIN_ERROR", payload: 'Please enter a valid domain (e.g., example.com)' });
      dispatch({ type: "UPDATE_DOMAIN", payload: { topLevelDomain: '', secondLevelDomain: '' } });
    }
  }

  return {
    cityRef,
    isValid,
    handleContactChange,
    handleSubmit,
    handleDomainInputChange,
    domainRegistrationText,
    domainInputValue,
    domainError,
    culture,
    domainRegistrationsListText,
    loading,
    APICallFailed
  };
}
