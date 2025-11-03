import { CountryDropdown, StateDropdown, type Country } from "@idahoedokpayi/react-country-state-selector";
import { type FC } from "react";
import { useLocalizationContext } from "../../hooks/useLocalizationContext";
import { useTrackComponent } from "../../hooks/useTrackComponent";
import { useGetStateProvinceInformation } from "../../services/getStateProvinceInformation";
import { useGetCountryInformation } from "../../services/getCountryInformation";
import { getBrowserCultureWithFallback } from "../../services/getBrowserCultureWithFallback";
import { useCultureInfo } from "../../contexts/CultureInfoContext";
import type { ContactInfoFormProps } from "./ContactInfoFormProps";
import "./DomainRegistration.css";

export const ContactInfoForm: FC<ContactInfoFormProps> = ({ state, cityRef, onChange, dispatch: _dispatch, errors = {} }) => {
  const { cultureInfo } = useCultureInfo();
  useTrackComponent('ContactInfoForm', { state, cityRef, onChange });
  const localization = useLocalizationContext();
  const localized = localization.DomainRegistration;
  
  const getStateProvinceInformation = useGetStateProvinceInformation();
  const getCountryInformation = useGetCountryInformation();
  const contactInfo = {
    ...state.domainRegistration?.contactInformation,
    country: state.domainRegistration?.contactInformation?.country || cultureInfo?.Country || getBrowserCultureWithFallback().Country
  };
  
  return (
    <fieldset className="domain-contact-fieldset">
  <legend>{localized.title}</legend>
      <label>
        {localized.firstName}:
        <input type="text" name="firstName" value={contactInfo.firstName ?? ""} onChange={onChange} required />
        {errors.firstName && <div className="error-message">{errors.firstName}</div>}
      </label>
      <br />
      <label>
        {localized.lastName}:
        <input type="text" name="lastName" value={contactInfo.lastName ?? ""} onChange={onChange} required />
        {errors.lastName && <div className="error-message">{errors.lastName}</div>}
      </label>
      <br />
      <label>
        {localized.address}:
        <input type="text" name="address" value={contactInfo.address ?? ""} onChange={onChange} required />
        {errors.address && <div className="error-message">{errors.address}</div>}
      </label>
      <br />
      <label>
        {localized.address2}:
        <input type="text" name="address2" value={contactInfo.address2 ?? ""} onChange={onChange} />
      </label>
      <br />
      <label>
        {localized.city}:
        <input type="text" name="city" value={contactInfo.city ?? ""} onChange={onChange} required ref={cityRef} />
        {errors.city && <div className="error-message">{errors.city}</div>}
      </label>
      <br />
      <StateDropdown
        country={cultureInfo?.Country || getBrowserCultureWithFallback().Country as Country}
        selectedState={contactInfo.state ?? ""}
        onStateChange={value => {
          const event = {
            target: { name: "state", value }
          } as React.ChangeEvent<HTMLInputElement | HTMLSelectElement>;
          onChange(event);
        }}
        culture={cultureInfo}
        getStateProvinceInformation={getStateProvinceInformation}
        Label={localized.state}
      />
      {errors.state && <div className="error-message">{errors.state}</div>}
      <br />
      <CountryDropdown
        selectedCountry={contactInfo.country ?? ""}
        culture={cultureInfo}
        Label={localized.country}
        onCountryChange={country => {
          const event = {
            target: { name: "country", value: country }
          } as React.ChangeEvent<HTMLInputElement | HTMLSelectElement>;
          onChange(event);
        }}
        getCountryInformation={getCountryInformation}
      />
      <br />
      <label>
        {localized.zipCode}:
        <input type="text" name="zipCode" value={contactInfo.zipCode ?? ""} onChange={onChange} required />
        {errors.zipCode && <div className="error-message">{errors.zipCode}</div>}
      </label>
      <br />
      <label>
        {localized.emailAddress}:
        <input type="email" name="emailAddress" value={contactInfo.emailAddress ?? ""} onChange={onChange} required />
        {errors.emailAddress && <div className="error-message">{errors.emailAddress}</div>}
      </label>
      <br />
      <label>
        {localized.telephoneNumber}:
        <input type="tel" name="telephoneNumber" value={contactInfo.telephoneNumber ?? ""} onChange={onChange} required />
        {errors.telephoneNumber && <div className="error-message">{errors.telephoneNumber}</div>}
      </label>
    </fieldset>
  );
};

