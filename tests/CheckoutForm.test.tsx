import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CheckoutForm } from '../src/components/Checkout/CheckoutForm';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import type { State } from '../src/types/State';

// Mock the domain registration submission hook
vi.mock('../src/hooks/useDomainRegistrationSubmission', () => ({
  useDomainRegistrationSubmission: vi.fn(),
  validateDomainRegistration: vi.fn()
}));

// Mock services
vi.mock('../src/services/applicationInsights', () => ({
  trackEvent: vi.fn()
}));

vi.mock('../src/services/formatError', () => ({
  formatError: vi.fn((error) => error?.message || String(error))
}));

vi.mock('../src/hooks/useLocalizationContext', () => ({
  useLocalizationContext: () => ({
    Checkout: {
      formTitle: 'Payment Information',
      errorMessage: 'Error:',
      buttonLabel: 'Pay Now'
    }
  })
}));

// Import mocked services
import { useDomainRegistrationSubmission } from '../src/hooks/useDomainRegistrationSubmission';

const mockUseDomainRegistrationSubmission = vi.mocked(useDomainRegistrationSubmission);

describe('CheckoutForm with domain registration', () => {
  const mockDispatch = vi.fn();
  const mockHandleSuccess = vi.fn();
  const mockSubmitDomainRegistration = vi.fn();
  
  const mockState: State = {
    authToken: 'test-token',
    domainRegistration: {
      domain: {
        topLevelDomain: 'com',
        secondLevelDomain: 'example'
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
    }
  };

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Setup domain registration submission hook mock
    mockUseDomainRegistrationSubmission.mockReturnValue({
      submitDomainRegistrationWithValidation: mockSubmitDomainRegistration,
      validateDomainRegistration: vi.fn()
    });
  });

  it('renders without crashing', async () => {
    const stripePromise = loadStripe('pk_test_mock');
    
    const { container } = render(
      <Elements stripe={stripePromise}>
        <CheckoutForm
          name="Test User"
          clientSecret="test_secret"
          handleSuccess={mockHandleSuccess}
          state={mockState}
          dispatch={mockDispatch}
        />
      </Elements>
    );

    await waitFor(() => {
      expect(container.querySelector('form')).toBeInTheDocument();
    });
  });

  it('initializes domain registration submission hook with correct parameters', () => {
    const stripePromise = loadStripe('pk_test_mock');
    
    render(
      <Elements stripe={stripePromise}>
        <CheckoutForm
          name="Test User"
          clientSecret="test_secret"
          handleSuccess={mockHandleSuccess}
          state={mockState}
          dispatch={mockDispatch}
        />
      </Elements>
    );

    expect(mockUseDomainRegistrationSubmission).toHaveBeenCalledWith('test-token', mockDispatch);
  });

  it('handles null authToken correctly', () => {
    const stripePromise = loadStripe('pk_test_mock');
    const stateWithNullToken = { ...mockState, authToken: null };
    
    render(
      <Elements stripe={stripePromise}>
        <CheckoutForm
          name="Test User"
          clientSecret="test_secret"
          handleSuccess={mockHandleSuccess}
          state={stateWithNullToken}
          dispatch={mockDispatch}
        />
      </Elements>
    );

    expect(mockUseDomainRegistrationSubmission).toHaveBeenCalledWith(undefined, mockDispatch);
  });

  it('verifies that the component correctly integrates with domain registration validation', () => {
    const stripePromise = loadStripe('pk_test_mock');
    
    // Clear mocks right before this specific test to ensure clean state
    vi.clearAllMocks();
    
    render(
      <Elements stripe={stripePromise}>
        <CheckoutForm
          name="Test User"
          clientSecret="test_secret"
          handleSuccess={mockHandleSuccess}
          state={mockState}
          dispatch={mockDispatch}
        />
      </Elements>
    );

    // Verify the hook was called at least once, ensuring domain registration logic is integrated
    expect(mockUseDomainRegistrationSubmission).toHaveBeenCalled();
    expect(mockUseDomainRegistrationSubmission).toHaveBeenCalledWith('test-token', mockDispatch);
  });
});
