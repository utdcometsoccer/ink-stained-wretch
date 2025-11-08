import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ContactInfoForm } from "../src/components/DomainRegistration/ContactInfoForm";
import { CultureInfoProvider } from "../src/contexts/CultureInfoContext";
import type { State } from "../src/types/State";
import type { CultureInfo } from "@idahoedokpayi/react-country-state-selector";
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
  };

  it("renders all contact fields", () => {
    const mockCityRef = { current: document.createElement('input') };
    const mockCultureInfo = { Culture: 'en-US', Language: 'en', Country: 'US' } as unknown as CultureInfo;
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
    const mockCultureInfo = { Culture: 'en-US', Language: 'en', Country: 'US' } as unknown as CultureInfo;
    render(
      <CultureInfoProvider cultureInfo={mockCultureInfo}>
        <ContactInfoForm state={baseState} cityRef={mockCityRef} onChange={handleChange} />
      </CultureInfoProvider>
    );
    fireEvent.change(screen.getByLabelText(/First Name:/i), { target: { value: "NewName" } });
    expect(handleChange).toHaveBeenCalled();
  });

  it("automatically sets country from culture info when country is undefined", () => {
    const handleChange = vi.fn();
    const mockCityRef = { current: document.createElement('input') };
    const mockCultureInfo = { Culture: 'fr-CA', Language: 'fr', Country: 'CA' } as unknown as CultureInfo;
    
    // Create state with undefined country
    const stateWithoutCountry: State = {
      domainRegistration: {
        contactInformation: {
          firstName: "Jean",
          lastName: "Dupont",
          address: "123 Rue Principal",
          address2: "",
          city: "Montreal",
          state: "QC",
          country: undefined, // This should trigger auto-persistence
          zipCode: "H1A 1A1",
          emailAddress: "jean@example.com",
          telephoneNumber: "5141234567",
        },
      },
    };

    render(
      <CultureInfoProvider cultureInfo={mockCultureInfo}>
        <ContactInfoForm state={stateWithoutCountry} cityRef={mockCityRef} onChange={handleChange} />
      </CultureInfoProvider>
    );

    // The useEffect should have triggered onChange with the detected country
    expect(handleChange).toHaveBeenCalledWith(
      expect.objectContaining({
        target: expect.objectContaining({
          name: 'country',
          value: 'CA'
        })
      })
    );
  });

  it("automatically sets country from culture info when country is empty string", () => {
    const handleChange = vi.fn();
    const mockCityRef = { current: document.createElement('input') };
    const mockCultureInfo = { Culture: 'de-DE', Language: 'de', Country: 'DE' } as unknown as CultureInfo;
    
    // Create state with empty country
    const stateWithEmptyCountry: State = {
      domainRegistration: {
        contactInformation: {
          firstName: "Hans",
          lastName: "Mueller",
          address: "Hauptstrasse 1",
          address2: "",
          city: "Berlin",
          state: "BE",
          country: "", // This should trigger auto-persistence
          zipCode: "10115",
          emailAddress: "hans@example.com",
          telephoneNumber: "4930123456",
        },
      },
    };

    render(
      <CultureInfoProvider cultureInfo={mockCultureInfo}>
        <ContactInfoForm state={stateWithEmptyCountry} cityRef={mockCityRef} onChange={handleChange} />
      </CultureInfoProvider>
    );

    // The useEffect should have triggered onChange with the detected country
    expect(handleChange).toHaveBeenCalledWith(
      expect.objectContaining({
        target: expect.objectContaining({
          name: 'country',
          value: 'DE'
        })
      })
    );
  });

  it("does not auto-set country when country is already populated", () => {
    const handleChange = vi.fn();
    const mockCityRef = { current: document.createElement('input') };
    const mockCultureInfo = { Culture: 'en-GB', Language: 'en', Country: 'GB' } as unknown as CultureInfo;
    
    // Use baseState which already has country set to "US"
    render(
      <CultureInfoProvider cultureInfo={mockCultureInfo}>
        <ContactInfoForm state={baseState} cityRef={mockCityRef} onChange={handleChange} />
      </CultureInfoProvider>
    );

    // onChange should NOT have been called automatically since country is already set
    expect(handleChange).not.toHaveBeenCalled();
  });
});
