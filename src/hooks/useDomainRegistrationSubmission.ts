import { useCallback } from 'react';
import type { Dispatch } from 'react';
import { trackEvent } from '../services/applicationInsights';
import { formatError } from '../services/formatError';
import { submitDomainRegistration } from '../services/submitDomainRegistration';
import { withAuthRetry } from '../services/withAuthRetry';
import type { Action } from '../types/Action';
import type { DomainRegistration } from '../types/DomainRegistration';

/**
 * Validates a domain registration object to ensure all required fields are present
 * @param domainRegistration - The domain registration to validate
 * @returns An object with isValid flag and any validation errors
 */
export function validateDomainRegistration(domainRegistration: DomainRegistration) {
  const errors: string[] = [];

  // Validate domain information
  if (!domainRegistration.domain) {
    errors.push('Domain information is required');
  } else {
    if (!domainRegistration.domain.secondLevelDomain?.trim()) {
      errors.push('Second level domain is required');
    }
    if (!domainRegistration.domain.topLevelDomain?.trim()) {
      errors.push('Top level domain is required');
    }
  }

  // Validate contact information
  if (!domainRegistration.contactInformation) {
    errors.push('Contact information is required');
  } else {
    const contact = domainRegistration.contactInformation;
    
    if (!contact.firstName?.trim()) {
      errors.push('First name is required');
    }
    if (!contact.lastName?.trim()) {
      errors.push('Last name is required');
    }
    if (!contact.address?.trim()) {
      errors.push('Address is required');
    }
    if (!contact.city?.trim()) {
      errors.push('City is required');
    }
    if (!contact.state?.trim()) {
      errors.push('State is required');
    }
    if (!contact.zipCode?.trim()) {
      errors.push('Zip code is required');
    }
    if (!contact.emailAddress?.trim()) {
      errors.push('Email address is required');
    } else {
      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(contact.emailAddress)) {
        errors.push('Valid email address is required');
      }
    }
    if (!contact.telephoneNumber?.trim()) {
      errors.push('Telephone number is required');
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Custom hook for handling domain registration submission
 */
export function useDomainRegistrationSubmission(authToken?: string, dispatch?: Dispatch<Action>) {
  
  const submitDomainRegistrationWithValidation = useCallback(async (
    domainRegistration: DomainRegistration
  ): Promise<{ success: boolean; errors?: string[]; submittedData?: DomainRegistration }> => {
    
    // Validate the domain registration
    const validation = validateDomainRegistration(domainRegistration);
    if (!validation.isValid) {
      trackEvent('DomainRegistrationValidationError', { 
        errors: validation.errors,
        domain: `${domainRegistration.domain?.secondLevelDomain}.${domainRegistration.domain?.topLevelDomain}`
      });
      return {
        success: false,
        errors: validation.errors
      };
    }

    try {
      // Submit the validated domain registration
      const submittedData = await withAuthRetry(
        (token) => submitDomainRegistration(domainRegistration, token),
        authToken,
        dispatch ? (newToken) => dispatch({ type: 'UPDATE_STATE', payload: { authToken: newToken } }) : undefined
      );

      trackEvent('DomainRegistrationSubmitted', { 
        domain: `${domainRegistration.domain?.secondLevelDomain}.${domainRegistration.domain?.topLevelDomain}`,
        submittedId: submittedData.id
      });

      return {
        success: true,
        submittedData
      };

    } catch (error) {
      console.error("Domain registration submission error:", error);
      trackEvent('DomainRegistrationError', { 
        error: formatError(error),
        domain: `${domainRegistration.domain?.secondLevelDomain}.${domainRegistration.domain?.topLevelDomain}`
      });
      
      return {
        success: false,
        errors: [formatError(error)]
      };
    }
  }, [authToken, dispatch]);

  return {
    submitDomainRegistrationWithValidation,
    validateDomainRegistration
  };
}