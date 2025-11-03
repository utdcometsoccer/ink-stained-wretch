import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { DomainRegistration } from "../src/components/DomainRegistration/index";
import type { State } from "../src/types/State";
import { CultureInfoProvider } from "../src/contexts/CultureInfoContext";

// Mock the validateDomainWhois function to avoid network calls
vi.mock('../src/services/validateDomainWhois', () => ({
  validateDomainWhois: vi.fn(() => Promise.resolve(true)), // Default: domain is available
}));

describe("DomainRegistration", () => {
  const mockDispatch = vi.fn();
  
  beforeEach(() => {
    mockDispatch.mockClear();
  });
  
  const baseState: State = {
    cultureInfo: undefined,
    domainRegistration: {
      contactInformation: {
        firstName: "John",
        lastName: "Doe",
        address: "123 Main St",
        address2: "",
        city: "Dallas",
        state: "TX",
        country: "US",
        zipCode: "75001",
        emailAddress: "john@example.com",
        telephoneNumber: "1234567890",
      },
    },
    error: undefined,
    isAuthenticated: undefined,
    Authors: undefined,
    userProfile: undefined,
    autoDetect: undefined,
    authToken: undefined,
    subscriptionPlans: undefined,
    selectedSubscriptionPlan: undefined,
  };

  it("renders the form and submits valid data", () => {
    const state = {
      ...baseState,
      domainRegistration: {
        ...baseState.domainRegistration, domain: {
          topLevelDomain: "com",
          secondLevelDomain: "newdomain",
        }
      }
    };
    const mockCultureInfo = { Culture: 'en-US', Language: 'en', Country: 'US' } as any;
    render(
      <CultureInfoProvider cultureInfo={mockCultureInfo}>
        <DomainRegistration state={state} dispatch={mockDispatch} />
      </CultureInfoProvider>
    );
    expect(screen.getByRole("heading", { name: /Domain Registration/i, level: 1 })).toBeInTheDocument();
    expect(screen.getByLabelText(/Domain:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/First Name:/i)).toHaveValue("John");
    fireEvent.change(screen.getByLabelText(/Domain:/i), { target: { value: "newdomain.com" } });
    fireEvent.click(screen.getByText(/Submit/i));
    expect(mockDispatch).toHaveBeenCalled();
  });

  it("shows error for invalid domain", async () => {
    const state = {
      ...baseState,
      domainRegistration: {
        ...baseState.domainRegistration, domain: {
          topLevelDomain: "",
          secondLevelDomain: "invalid_domain",
        }
      }
    };
    const mockCultureInfo = { Culture: 'en-US', Language: 'en', Country: 'US' } as any;
    render(
      <CultureInfoProvider cultureInfo={mockCultureInfo}>
        <DomainRegistration state={state} dispatch={mockDispatch} />
      </CultureInfoProvider>
    );
    
    // Enter an invalid domain (missing TLD)
    fireEvent.change(screen.getByLabelText(/Domain:/i), { target: { value: "invalid_domain" } });
    fireEvent.click(screen.getByText(/Submit/i));
    
    // Check for domain error message (shown under domain input)
    await waitFor(() => {
      const errorMessages = screen.queryAllByText(/valid domain/i);
      expect(errorMessages.length).toBeGreaterThan(0);
    });
  });

  it("shows email validation error under email field", async () => {
    const state = {
      ...baseState,
      domainRegistration: {
        ...baseState.domainRegistration,
        domain: {
          topLevelDomain: "com",
          secondLevelDomain: "testdomain",
        },
        contactInformation: {
          ...baseState.domainRegistration!.contactInformation!,
          emailAddress: "invalid-email",
        }
      }
    };
    const mockCultureInfo = { Culture: 'en-US', Language: 'en', Country: 'US' } as any;
    render(
      <CultureInfoProvider cultureInfo={mockCultureInfo}>
        <DomainRegistration state={state} dispatch={mockDispatch} />
      </CultureInfoProvider>
    );
    
    fireEvent.change(screen.getByLabelText(/Domain:/i), { target: { value: "testdomain.com" } });
    fireEvent.click(screen.getByText(/Submit/i));
    
    await waitFor(() => {
      const errorMessages = screen.queryAllByText(/valid email address/i);
      expect(errorMessages.length).toBeGreaterThan(0);
    });
  });

  it("shows phone validation error under phone field", async () => {
    const state = {
      ...baseState,
      domainRegistration: {
        ...baseState.domainRegistration,
        domain: {
          topLevelDomain: "com",
          secondLevelDomain: "testdomain",
        },
        contactInformation: {
          ...baseState.domainRegistration!.contactInformation!,
          telephoneNumber: "123",
        }
      }
    };
    const mockCultureInfo = { Culture: 'en-US', Language: 'en', Country: 'US' } as any;
    render(
      <CultureInfoProvider cultureInfo={mockCultureInfo}>
        <DomainRegistration state={state} dispatch={mockDispatch} />
      </CultureInfoProvider>
    );
    
    fireEvent.change(screen.getByLabelText(/Domain:/i), { target: { value: "testdomain.com" } });
    fireEvent.click(screen.getByText(/Submit/i));
    
    await waitFor(() => {
      const errorMessages = screen.queryAllByText(/valid telephone number/i);
      expect(errorMessages.length).toBeGreaterThan(0);
    });
  });

  it("shows required field error under first name field", async () => {
    const state = {
      ...baseState,
      domainRegistration: {
        ...baseState.domainRegistration,
        domain: {
          topLevelDomain: "com",
          secondLevelDomain: "testdomain",
        },
        contactInformation: {
          ...baseState.domainRegistration!.contactInformation!,
          firstName: "",
        }
      }
    };
    const mockCultureInfo = { Culture: 'en-US', Language: 'en', Country: 'US' } as any;
    render(
      <CultureInfoProvider cultureInfo={mockCultureInfo}>
        <DomainRegistration state={state} dispatch={mockDispatch} />
      </CultureInfoProvider>
    );
    
    fireEvent.change(screen.getByLabelText(/Domain:/i), { target: { value: "testdomain.com" } });
    fireEvent.click(screen.getByText(/Submit/i));
    
    await waitFor(() => {
      const errorMessages = screen.queryAllByText(/First name is required/i);
      expect(errorMessages.length).toBeGreaterThan(0);
    });
  });

  it("shows required field error under city field", async () => {
    const state = {
      ...baseState,
      domainRegistration: {
        ...baseState.domainRegistration,
        domain: {
          topLevelDomain: "com",
          secondLevelDomain: "testdomain",
        },
        contactInformation: {
          ...baseState.domainRegistration!.contactInformation!,
          city: "",
        }
      }
    };
    const mockCultureInfo = { Culture: 'en-US', Language: 'en', Country: 'US' } as any;
    render(
      <CultureInfoProvider cultureInfo={mockCultureInfo}>
        <DomainRegistration state={state} dispatch={mockDispatch} />
      </CultureInfoProvider>
    );
    
    fireEvent.change(screen.getByLabelText(/Domain:/i), { target: { value: "testdomain.com" } });
    fireEvent.click(screen.getByText(/Submit/i));
    
    await waitFor(() => {
      const errorMessages = screen.queryAllByText(/City is required/i);
      expect(errorMessages.length).toBeGreaterThan(0);
    });
  });
});
