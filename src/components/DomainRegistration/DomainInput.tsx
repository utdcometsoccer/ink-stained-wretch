import React from "react";

export interface DomainInputProps {
  value: string;
  error: string | null;
  isValid: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function DomainInput({ value, error, isValid, onChange }: DomainInputProps) {
  return (
    <label>
      Domain:
      <input
        type="text"
        name="domain"
        value={value}
        onChange={onChange}
        placeholder="example.com"
        required
        className={
          error
            ? "domain-input-error"
            : isValid
              ? "domain-input-success"
              : undefined
        }
      />
      {error && <div className="error-message">{error}</div>}
      {!error && isValid && <div className="domain-success-message">Domain format is valid and available!</div>}
    </label>
  );
}
