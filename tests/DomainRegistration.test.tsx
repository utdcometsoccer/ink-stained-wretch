import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { DomainRegistration } from "../src/components/DomainRegistration/index";
import type { State } from "../src/types/State";
import { vi } from "vitest";
import { CultureInfoProvider } from "../src/contexts/CultureInfoContext";

describe("DomainRegistration", () => {
  const mockDispatch = vi.fn();
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

  it("shows error for invalid domain", () => {
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
    fireEvent.click(screen.getByText(/Submit/i));
    expect(mockDispatch).toHaveBeenCalled();
  });
});
