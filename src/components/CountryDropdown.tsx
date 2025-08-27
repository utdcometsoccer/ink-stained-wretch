import { type ChangeEvent } from "react";
import { regionNames } from "../constants/regionNames";
import type { Region } from "../types/Region";

export function CountryDropdown({ region, value, onChange, required = false, name = "country", defaultValue }: {
  region?: Region;
  value?: string;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  required?: boolean;
  name?: string;
  defaultValue?: string;
}) {
  // Always show all regions
  const options = Object.entries(regionNames);

  // Determine selected value: if region is valid, select its label; else use value or defaultValue
  const selectedValue = region && regionNames[region]
    ? regionNames[region]
    : value || defaultValue || "";

  return (
    <select
      name={name}
      defaultValue={selectedValue}
      onChange={onChange}
      required={required}
      title="Country"
    >
      <option value="">Select Country</option>
      {options.map(([code, label]) => (
        <option key={code} value={label}>{label} ({code})</option>
      ))}
    </select>
  );
}
