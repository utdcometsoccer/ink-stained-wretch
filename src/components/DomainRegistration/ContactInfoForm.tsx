

import { type FC } from "react";
import { StateDropdown, CountryDropdown } from "@idahoedokpayi/react-country-state-selector";
import type { ContactInfoFormProps } from "./ContactInfoFormProps";
import "./DomainRegistration.css";

export const ContactInfoForm: FC<ContactInfoFormProps> = ({ state, cultureInfo, cityRef, onChange }) => {
  const contactInfo = {
    ...state.domainRegistration?.contactInformation,
    country: state.domainRegistration?.contactInformation?.country || cultureInfo?.Country || "US"
  };
  return (
    <fieldset className="domain-contact-fieldset">
      <legend>Contact Information</legend>
      <label>
        First Name:
        <input type="text" name="firstName" value={contactInfo.firstName ?? ""} onChange={onChange} required />
      </label>
      <br />
      <label>
        Last Name:
        <input type="text" name="lastName" value={contactInfo.lastName ?? ""} onChange={onChange} required />
      </label>
      <br />
      <label>
        Address:
        <input type="text" name="address" value={contactInfo.address ?? ""} onChange={onChange} required />
      </label>
      <br />
      <label>
        Address 2:
        <input type="text" name="address2" value={contactInfo.address2 ?? ""} onChange={onChange} />
      </label>
      <br />
      <label>
        City:
        <input type="text" name="city" value={contactInfo.city ?? ""} onChange={onChange} required ref={cityRef} />
      </label>
      <br />
      <StateDropdown
        country={cultureInfo?.Country || "US"}
        selectedState={contactInfo.state ?? ""}
        onStateChange={value => {
          const event = {
            target: { name: "state", value }
          } as React.ChangeEvent<HTMLInputElement | HTMLSelectElement>;
          onChange(event);
        }}
        Label="State / Province:"
      />
      <br />
      <CountryDropdown
        selectedCountry={contactInfo.country ?? ""}
        culture={cultureInfo}
        Label="Country:"
        onCountryChange={country => {
          const event = {
            target: { name: "country", value: country }
          } as React.ChangeEvent<HTMLInputElement | HTMLSelectElement>;
          onChange(event);
        }}
      />
      <br />
      <label>
        Zip Code:
        <input type="text" name="zipCode" value={contactInfo.zipCode ?? ""} onChange={onChange} required />
      </label>
      <br />
      <label>
        Email Address:
        <input type="email" name="emailAddress" value={contactInfo.emailAddress ?? ""} onChange={onChange} required />
      </label>
      <br />
      <label>
        Telephone Number:
        <input type="tel" name="telephoneNumber" value={contactInfo.telephoneNumber ?? ""} onChange={onChange} required />
      </label>
    </fieldset>
  );
};

