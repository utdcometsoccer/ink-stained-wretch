import { type ChangeEvent } from "react";
import { stateProvinceNames } from "../constants/stateProvinceNames";
import type { Region } from "../types/Region";

export function StateProvinceDropdown({ region, value, onChange, required = false, name = "state" }: {
  region?: Region;
  value?: string;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  required?: boolean;
  name?: string;
}) {
  // Get states/provinces for the selected region, or empty array
  const options = region && stateProvinceNames[region] ? stateProvinceNames[region] : [];

  return (
    <select
      name={name}
      defaultValue={value || ""}
      onChange={onChange}
      required={required}
      title="State / Province"
    >
      <option value="">Select State / Province</option>
      {options.map((label) => (
        <option key={label} value={label}>{label}</option>
      ))}
    </select>
  );
}
