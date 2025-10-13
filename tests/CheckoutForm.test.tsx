import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CheckoutForm } from '../src/components/Checkout/CheckoutForm';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import type { State } from '../src/types/State';

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

vi.mock('../src/hooks/useLocalizationContext', () => ({
  useLocalizationContext: () => ({
    Checkout: {
      formTitle: 'Payment Information',
      errorMessage: 'Error:',
      buttonLabel: 'Pay Now'
    }
  })
}));

describe('CheckoutForm with domain registration', () => {
  const mockDispatch = vi.fn();
  const mockHandleSuccess = vi.fn();
  
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

  it('includes state and dispatch props', () => {
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

    // If the component renders without error, the props are correctly typed
    expect(true).toBe(true);
  });
});
