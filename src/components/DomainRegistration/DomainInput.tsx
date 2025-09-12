import { type FC } from "react";
import { useLocalizationContext } from "../../hooks/useLocalizationContext";
import { useTrackComponent } from "../../hooks/useTrackComponent";

export interface DomainInputProps {
  value: string;
  error: string | null;
  isValid: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const DomainInput:FC<DomainInputProps> = ({ value, error, isValid, onChange}: DomainInputProps) => {
  useTrackComponent('DomainInput', { value, error, isValid, onChange});

  const localized = useLocalizationContext().DomainInput;
  return (
    <label>
      {localized.label}
      <input
        type="text"
        name="domain"
        value={value}
        onChange={onChange}
        placeholder={localized.placeholder}
        required
        className={
          error
            ? "domain-input-error"
            : isValid
              ? "domain-input-success"
              : undefined
        }
      />
      {error && <div className="error-message">{localized.error ?? error}</div>}
      {!error && isValid && <div className="domain-success-message">{localized.success}</div>}
    </label>
  );
}
