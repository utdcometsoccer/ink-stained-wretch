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
import type { ContactInfoErrors } from "../types/DomainRegistrationState";
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
    APICallFailed: false,
    contactInfoErrors: {}
  });
  const cityRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (error) {
      domainRegistrationDispatch({ type: "SET_API_CALL_FAILED", payload: true });
    }
  }, [error, domainRegistrationDispatch]);
  const { APICallFailed, domainError, domainInputValue, contactInfoErrors } = domainRegistrationState;  
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
      type: "SET_DOMAIN_INPUT_VALUE", payload: { topLevelDomain, secondLevelDomain }
    });
    
    // Clear previous errors
    const errors: ContactInfoErrors = {};
    
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
    
    // Validate individual fields
    if (!contactInfo.firstName || contactInfo.firstName.trim() === '') {
      errors.firstName = 'First name is required.';
    }
    if (!contactInfo.lastName || contactInfo.lastName.trim() === '') {
      errors.lastName = 'Last name is required.';
    }
    if (!contactInfo.address || contactInfo.address.trim() === '') {
      errors.address = 'Address is required.';
    }
    if (!contactInfo.city || contactInfo.city.trim() === '') {
      errors.city = 'City is required.';
    }
    if (!contactInfo.state || contactInfo.state.trim() === '') {
      errors.state = 'State is required.';
    }
    if (!contactInfo.zipCode || contactInfo.zipCode.trim() === '') {
      errors.zipCode = 'Zip code is required.';
    }
    if (!contactInfo.emailAddress || contactInfo.emailAddress.trim() === '') {
      errors.emailAddress = 'Email address is required.';
    } else if (!validateEmail(contactInfo.emailAddress)) {
      errors.emailAddress = 'Please enter a valid email address.';
    }
    if (!contactInfo.telephoneNumber || contactInfo.telephoneNumber.trim() === '') {
      errors.telephoneNumber = 'Telephone number is required.';
    } else if (!validatePhone(contactInfo.telephoneNumber)) {
      errors.telephoneNumber = 'Please enter a valid telephone number.';
    }
    
    // If there are any errors, set them and stop
    if (Object.keys(errors).length > 0) {
      domainRegistrationDispatch({ type: "SET_CONTACT_INFO_ERRORS", payload: errors });
      return;
    }
    
    // Clear errors if validation passes
    domainRegistrationDispatch({ type: "SET_CONTACT_INFO_ERRORS", payload: {} });
    
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
    APICallFailed,
    contactInfoErrors
  };
}
