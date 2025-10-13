import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ContactInfoForm } from "../src/components/DomainRegistration/ContactInfoForm";
import { CultureInfoProvider } from "../src/contexts/CultureInfoContext";
import type { State } from "../src/types/State";
describe("ContactInfoForm", () => {
  const baseState: State = {
    domainRegistration: {
      contactInformation: {
        firstName: "Jane",
        lastName: "Smith",
        address: "456 Main St",
        address2: "Apt 2",
        city: "Austin",
        state: "TX",
        country: "US",
        zipCode: "73301",
        emailAddress: "jane@example.com",
        telephoneNumber: "9876543210",
      },
    },
  } as any;

  it("renders all contact fields", () => {
    const mockCityRef = { current: document.createElement('input') };
    const mockCultureInfo = { Culture: 'en-US', Language: 'en', Country: 'US' } as any;
    render(
      <CultureInfoProvider cultureInfo={mockCultureInfo}>
        <ContactInfoForm state={baseState} cityRef={mockCityRef} onChange={() => {}} />
      </CultureInfoProvider>
    );
    expect(screen.getByLabelText(/First Name:/i)).toHaveValue("Jane");
    expect(screen.getByLabelText(/Last Name:/i)).toHaveValue("Smith");
    expect(screen.getByLabelText('Address:', { exact: true })).toHaveValue("456 Main St");
    expect(screen.getByLabelText(/City:/i)).toHaveValue("Austin");
    expect(screen.getByLabelText(/Zip Code:/i)).toHaveValue("73301");
    expect(screen.getByLabelText('Email Address:', { exact: true })).toHaveValue("jane@example.com");
    expect(screen.getByLabelText(/Telephone Number:/i)).toHaveValue("9876543210");
  });

  it("calls onChange when input changes", () => {
    const handleChange = vi.fn();
    const mockCityRef = { current: document.createElement('input') };
    const mockCultureInfo = { Culture: 'en-US', Language: 'en', Country: 'US' } as any;
    render(
      <CultureInfoProvider cultureInfo={mockCultureInfo}>
        <ContactInfoForm state={baseState} cityRef={mockCityRef} onChange={handleChange} />
      </CultureInfoProvider>
    );
    fireEvent.change(screen.getByLabelText(/First Name:/i), { target: { value: "NewName" } });
    expect(handleChange).toHaveBeenCalled();
  });
});
