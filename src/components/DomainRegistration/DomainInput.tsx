import React from "react";
import { useTrackComponent } from "../../hooks/useTrackComponent";
import { useGetLocalizedText } from "../../hooks/useGetLocalizedText";

export interface DomainInputProps {
  value: string;
  error: string | null;
  isValid: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  culture?: string;
}

export function DomainInput({ value, error, isValid, onChange, culture = 'en-us' }: DomainInputProps) {
  useTrackComponent('DomainInput', { value, error, isValid, onChange, culture });
  const localized = useGetLocalizedText(culture)?.DomainInput;
  return (
    <label>
      {localized?.label ?? 'Domain:'}
      <input
        type="text"
        name="domain"
        value={value}
        onChange={onChange}
        placeholder={localized?.placeholder ?? 'example.com'}
        required
        className={
          error
            ? "domain-input-error"
            : isValid
              ? "domain-input-success"
              : undefined
        }
      />
      {error && <div className="error-message">{localized?.error ?? error}</div>}
      {!error && isValid && <div className="domain-success-message">{localized?.success ?? 'Domain format is valid and available!'}</div>}
    </label>
  );
}
