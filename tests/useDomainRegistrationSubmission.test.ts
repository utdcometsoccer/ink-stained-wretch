import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { 
  validateDomainRegistration, 
  useDomainRegistrationSubmission 
} from '../src/hooks/useDomainRegistrationSubmission';
import type { DomainRegistration } from '../src/types/DomainRegistration';

// Mock services
vi.mock('../src/services/submitDomainRegistration', () => ({
  submitDomainRegistration: vi.fn()
}));

vi.mock('../src/services/withAuthRetry', () => ({
  withAuthRetry: vi.fn()
}));

vi.mock('../src/services/applicationInsights', () => ({
  trackEvent: vi.fn()
}));

vi.mock('../src/services/formatError', () => ({
  formatError: vi.fn((error) => error?.message || String(error))
}));

// Import mocked services
import { submitDomainRegistration } from '../src/services/submitDomainRegistration';
import { withAuthRetry } from '../src/services/withAuthRetry';
import { trackEvent } from '../src/services/applicationInsights';

const mockSubmitDomainRegistration = vi.mocked(submitDomainRegistration);
const mockWithAuthRetry = vi.mocked(withAuthRetry);
const mockTrackEvent = vi.mocked(trackEvent);

describe('validateDomainRegistration', () => {
  const validDomainRegistration: DomainRegistration = {
    domain: {
      secondLevelDomain: 'example',
      topLevelDomain: 'com'
    },
    contactInformation: {
      firstName: 'John',
      lastName: 'Doe',
      address: '123 Main St',
      city: 'Anytown',
      state: 'CA',
      zipCode: '12345',
      emailAddress: 'john@example.com',
      telephoneNumber: '555-1234'
    }
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Valid domain registrations', () => {
    it('should validate a complete and valid domain registration', () => {
      const result = validateDomainRegistration(validDomainRegistration);
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('should validate when optional fields are missing but required fields are present', () => {
      const minimalValidRegistration: DomainRegistration = {
        domain: {
          secondLevelDomain: 'test',
          topLevelDomain: 'org'
        },
        contactInformation: {
          firstName: 'Jane',
          lastName: 'Smith',
          address: '456 Oak Ave',
          city: 'Testville',
          state: 'NY',
          zipCode: '67890',
          emailAddress: 'jane@test.org',
          telephoneNumber: '555-5678'
        }
      };

      const result = validateDomainRegistration(minimalValidRegistration);
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual([]);
    });
  });

  describe('Domain validation', () => {
    it('should reject when domain is missing', () => {
      const registration = { ...validDomainRegistration, domain: undefined };
      const result = validateDomainRegistration(registration);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Domain information is required');
    });

    it('should reject when secondLevelDomain is missing', () => {
      const registration = {
        ...validDomainRegistration,
        domain: { ...validDomainRegistration.domain!, secondLevelDomain: '' }
      };
      const result = validateDomainRegistration(registration);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Second level domain is required');
    });

    it('should reject when secondLevelDomain is only whitespace', () => {
      const registration = {
        ...validDomainRegistration,
        domain: { ...validDomainRegistration.domain!, secondLevelDomain: '   ' }
      };
      const result = validateDomainRegistration(registration);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Second level domain is required');
    });

    it('should reject when topLevelDomain is missing', () => {
      const registration = {
        ...validDomainRegistration,
        domain: { ...validDomainRegistration.domain!, topLevelDomain: '' }
      };
      const result = validateDomainRegistration(registration);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Top level domain is required');
    });
  });

  describe('Contact information validation', () => {
    it('should reject when contactInformation is missing', () => {
      const registration = { ...validDomainRegistration, contactInformation: undefined };
      const result = validateDomainRegistration(registration);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Contact information is required');
    });

    it('should reject when firstName is missing', () => {
      const registration = {
        ...validDomainRegistration,
        contactInformation: { ...validDomainRegistration.contactInformation!, firstName: '' }
      };
      const result = validateDomainRegistration(registration);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('First name is required');
    });

    it('should reject when lastName is missing', () => {
      const registration = {
        ...validDomainRegistration,
        contactInformation: { ...validDomainRegistration.contactInformation!, lastName: '' }
      };
      const result = validateDomainRegistration(registration);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Last name is required');
    });

    it('should reject when address is missing', () => {
      const registration = {
        ...validDomainRegistration,
        contactInformation: { ...validDomainRegistration.contactInformation!, address: '' }
      };
      const result = validateDomainRegistration(registration);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Address is required');
    });

    it('should reject when city is missing', () => {
      const registration = {
        ...validDomainRegistration,
        contactInformation: { ...validDomainRegistration.contactInformation!, city: '' }
      };
      const result = validateDomainRegistration(registration);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('City is required');
    });

    it('should reject when state is missing', () => {
      const registration = {
        ...validDomainRegistration,
        contactInformation: { ...validDomainRegistration.contactInformation!, state: '' }
      };
      const result = validateDomainRegistration(registration);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('State is required');
    });

    it('should reject when zipCode is missing', () => {
      const registration = {
        ...validDomainRegistration,
        contactInformation: { ...validDomainRegistration.contactInformation!, zipCode: '' }
      };
      const result = validateDomainRegistration(registration);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Zip code is required');
    });

    it('should reject when emailAddress is missing', () => {
      const registration = {
        ...validDomainRegistration,
        contactInformation: { ...validDomainRegistration.contactInformation!, emailAddress: '' }
      };
      const result = validateDomainRegistration(registration);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Email address is required');
    });

    it('should reject when emailAddress is invalid format', () => {
      const registration = {
        ...validDomainRegistration,
        contactInformation: { ...validDomainRegistration.contactInformation!, emailAddress: 'invalid-email' }
      };
      const result = validateDomainRegistration(registration);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Valid email address is required');
    });

    it('should reject when telephoneNumber is missing', () => {
      const registration = {
        ...validDomainRegistration,
        contactInformation: { ...validDomainRegistration.contactInformation!, telephoneNumber: '' }
      };
      const result = validateDomainRegistration(registration);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Telephone number is required');
    });

    it('should collect multiple validation errors', () => {
      const invalidRegistration: DomainRegistration = {
        domain: {
          secondLevelDomain: '',
          topLevelDomain: ''
        },
        contactInformation: {
          firstName: '',
          lastName: '',
          address: '',
          city: '',
          state: '',
          zipCode: '',
          emailAddress: 'invalid-email',
          telephoneNumber: ''
        }
      };

      const result = validateDomainRegistration(invalidRegistration);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(10);
      expect(result.errors).toContain('Second level domain is required');
      expect(result.errors).toContain('Top level domain is required');
      expect(result.errors).toContain('First name is required');
      expect(result.errors).toContain('Last name is required');
      expect(result.errors).toContain('Address is required');
      expect(result.errors).toContain('City is required');
      expect(result.errors).toContain('State is required');
      expect(result.errors).toContain('Zip code is required');
      expect(result.errors).toContain('Valid email address is required');
      expect(result.errors).toContain('Telephone number is required');
    });
  });
});

describe('useDomainRegistrationSubmission', () => {
  const validDomainRegistration: DomainRegistration = {
    domain: {
      secondLevelDomain: 'example',
      topLevelDomain: 'com'
    },
    contactInformation: {
      firstName: 'John',
      lastName: 'Doe',
      address: '123 Main St',
      city: 'Anytown',
      state: 'CA',
      zipCode: '12345',
      emailAddress: 'john@example.com',
      telephoneNumber: '555-1234'
    }
  };

  const mockDispatch = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Successful submission', () => {
    it('should submit valid domain registration successfully', async () => {
      const submittedData = { ...validDomainRegistration, id: 'test-id-123' };
      
      mockWithAuthRetry.mockResolvedValue(submittedData);

      const { result } = renderHook(() => 
        useDomainRegistrationSubmission('test-token', mockDispatch)
      );

      let submissionResult;
      await act(async () => {
        submissionResult = await result.current.submitDomainRegistrationWithValidation(validDomainRegistration);
      });

      expect(submissionResult).toEqual({
        success: true,
        submittedData
      });

      expect(mockWithAuthRetry).toHaveBeenCalledWith(
        expect.any(Function),
        'test-token',
        expect.any(Function)
      );

      expect(mockTrackEvent).toHaveBeenCalledWith('DomainRegistrationSubmitted', {
        domain: 'example.com',
        submittedId: 'test-id-123'
      });
    });

    it('should verify the correct data is posted to submitDomainRegistration', async () => {
      const submittedData = { ...validDomainRegistration, id: 'test-id-456' };
      
      // Mock withAuthRetry to capture and call the submission function
      mockWithAuthRetry.mockImplementation(async (submitFn, token) => {
        return await submitFn(token || undefined);
      });
      
      mockSubmitDomainRegistration.mockResolvedValue(submittedData);

      const { result } = renderHook(() => 
        useDomainRegistrationSubmission('test-token', mockDispatch)
      );

      await act(async () => {
        await result.current.submitDomainRegistrationWithValidation(validDomainRegistration);
      });

      // Verify that submitDomainRegistration was called with the exact registration data
      expect(mockSubmitDomainRegistration).toHaveBeenCalledWith(
        validDomainRegistration,
        'test-token'
      );

      // Verify the data structure matches what we expect to be posted
      const [postedData] = mockSubmitDomainRegistration.mock.calls[0];
      expect(postedData).toEqual({
        domain: {
          secondLevelDomain: 'example',
          topLevelDomain: 'com'
        },
        contactInformation: {
          firstName: 'John',
          lastName: 'Doe',
          address: '123 Main St',
          city: 'Anytown',
          state: 'CA',
          zipCode: '12345',
          emailAddress: 'john@example.com',
          telephoneNumber: '555-1234'
        }
      });
    });
  });

  describe('Validation failure', () => {
    it('should return validation errors without attempting submission for invalid data', async () => {
      const invalidRegistration: DomainRegistration = {
        domain: {
          secondLevelDomain: '',
          topLevelDomain: 'com'
        },
        contactInformation: {
          firstName: '',
          lastName: 'Doe',
          address: '123 Main St',
          city: 'Anytown',
          state: 'CA',
          zipCode: '12345',
          emailAddress: 'john@example.com',
          telephoneNumber: '555-1234'
        }
      };

      const { result } = renderHook(() => 
        useDomainRegistrationSubmission('test-token', mockDispatch)
      );

      let submissionResult;
      await act(async () => {
        submissionResult = await result.current.submitDomainRegistrationWithValidation(invalidRegistration);
      });

      expect(submissionResult).toEqual({
        success: false,
        errors: [
          'Second level domain is required',
          'First name is required'
        ]
      });

      // Verify submission was never attempted
      expect(mockWithAuthRetry).not.toHaveBeenCalled();
      expect(mockSubmitDomainRegistration).not.toHaveBeenCalled();

      // Verify validation error was tracked
      expect(mockTrackEvent).toHaveBeenCalledWith('DomainRegistrationValidationError', {
        errors: ['Second level domain is required', 'First name is required'],
        domain: '.com'
      });
    });
  });

  describe('Submission failure', () => {
    it('should handle submission errors gracefully', async () => {
      const submissionError = new Error('API Error: 500');
      mockWithAuthRetry.mockRejectedValue(submissionError);

      const { result } = renderHook(() => 
        useDomainRegistrationSubmission('test-token', mockDispatch)
      );

      let submissionResult;
      await act(async () => {
        submissionResult = await result.current.submitDomainRegistrationWithValidation(validDomainRegistration);
      });

      expect(submissionResult).toEqual({
        success: false,
        errors: ['API Error: 500']
      });

      expect(mockTrackEvent).toHaveBeenCalledWith('DomainRegistrationError', {
        error: 'API Error: 500',
        domain: 'example.com'
      });
    });
  });

  describe('Hook behavior without dispatch', () => {
    it('should work correctly when dispatch is not provided', async () => {
      const submittedData = { ...validDomainRegistration, id: 'test-id-789' };
      mockWithAuthRetry.mockResolvedValue(submittedData);

      const { result } = renderHook(() => 
        useDomainRegistrationSubmission('test-token')
      );

      let submissionResult;
      await act(async () => {
        submissionResult = await result.current.submitDomainRegistrationWithValidation(validDomainRegistration);
      });

      expect(submissionResult).toEqual({
        success: true,
        submittedData
      });

      expect(mockWithAuthRetry).toHaveBeenCalledWith(
        expect.any(Function),
        'test-token',
        undefined
      );
    });
  });
});