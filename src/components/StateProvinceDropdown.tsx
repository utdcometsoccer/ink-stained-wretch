import { type ChangeEvent } from "react";
import { stateProvinceNames } from "../constants/stateProvinceNames";
import type { Region } from "../types/Region";

export function StateProvinceDropdown({
  region,
  value,
  onChange,
  onTextChange,
  required = false,
  name = "state"
}: {
  region?: Region;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLSelectElement>) => void;
  onTextChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  name?: string;
}) {
  // Get states/provinces for the selected region, or empty array
  const options = region && stateProvinceNames[region] ? stateProvinceNames[region] : [];

  // If no options or only "N/A", show text input
  const showTextInput = options.length === 0 || (options.length === 1 && options[0] === "N/A");

  return showTextInput ? (
    <input
      type="text"
      name={name}
      value={value || ""}
      onChange={onTextChange}
      required={required}
      placeholder="Enter State / Province"
      title="State / Province"
    />
  ) : (
    <select
      name={name}
      value={value || ""}
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
