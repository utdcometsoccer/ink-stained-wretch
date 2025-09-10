

import { type FC } from "react";
import { StateDropdown, CountryDropdown } from "@idahoedokpayi/react-country-state-selector";
import type { ContactInfoFormProps } from "./ContactInfoFormProps";
import "./DomainRegistration.css";
import { useTrackComponent } from "../../hooks/useTrackComponent";
import { useGetLocalizedText } from "../../hooks/useGetLocalizedText";

export const ContactInfoForm: FC<ContactInfoFormProps> = ({ state, cultureInfo, cityRef, onChange, culture = 'en-us' }) => {
  useTrackComponent('ContactInfoForm', { state, cultureInfo, cityRef, onChange, culture });
  const localized = useGetLocalizedText(culture)?.DomainRegistration;
  const contactInfo = {
    ...state.domainRegistration?.contactInformation,
    country: state.domainRegistration?.contactInformation?.country || cultureInfo?.Country || "US"
  };
  
  return (
    <fieldset className="domain-contact-fieldset">
      <legend>{localized?.title ?? 'Contact Information'}</legend>
      <label>
        {localized?.firstName ?? 'First Name'}:
        <input type="text" name="firstName" value={contactInfo.firstName ?? ""} onChange={onChange} required />
      </label>
      <br />
      <label>
        {localized?.lastName ?? 'Last Name'}:
        <input type="text" name="lastName" value={contactInfo.lastName ?? ""} onChange={onChange} required />
      </label>
      <br />
      <label>
        {localized?.address ?? 'Address'}:
        <input type="text" name="address" value={contactInfo.address ?? ""} onChange={onChange} required />
      </label>
      <br />
      <label>
        {localized?.address2 ?? 'Address 2'}:
        <input type="text" name="address2" value={contactInfo.address2 ?? ""} onChange={onChange} />
      </label>
      <br />
      <label>
        {localized?.city ?? 'City'}:
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
        Label={localized?.state ?? "State / Province:"}
      />
      <br />
      <CountryDropdown
        selectedCountry={contactInfo.country ?? ""}
        culture={cultureInfo}
        Label={localized?.country ?? "Country:"}
        onCountryChange={country => {
          const event = {
            target: { name: "country", value: country }
          } as React.ChangeEvent<HTMLInputElement | HTMLSelectElement>;
          onChange(event);
        }}
      />
      <br />
      <label>
        {localized?.zipCode ?? "Zip Code"}:
        <input type="text" name="zipCode" value={contactInfo.zipCode ?? ""} onChange={onChange} required />
      </label>
      <br />
      <label>
        {localized?.emailAddress ?? "Email Address"}:
        <input type="email" name="emailAddress" value={contactInfo.emailAddress ?? ""} onChange={onChange} required />
      </label>
      <br />
      <label>
        {localized?.telephoneNumber ?? "Telephone Number"}:
        <input type="tel" name="telephoneNumber" value={contactInfo.telephoneNumber ?? ""} onChange={onChange} required />
      </label>
    </fieldset>
  );
};

