import { type ChangeEvent } from "react";

export function StateProvinceDropdown({
  options,
  value,
  onChange,
  onTextChange,
  required = false,
  name = "state",
  inputRef
}: {
  options: string[];
  value?: string;
  onChange?: (e: ChangeEvent<HTMLSelectElement>) => void;
  onTextChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  name?: string;
  inputRef?: React.RefObject<HTMLInputElement | HTMLSelectElement | null>;
}) {

  // If no options or only "N/A", show text input
  const showTextInput = options.length === 0 || (options.length === 1 && options[0] === "N/A");

  return showTextInput ? (
    <input
      type="text"
      name={name}
      defaultValue={value || ""}
      onChange={onTextChange}
      required={required}
      placeholder="Enter State / Province"
      title="State / Province"
      ref={inputRef as React.RefObject<HTMLInputElement>}
    />
  ) : (
    <select
      name={name}
      defaultValue={value || ""}
      onChange={onChange}
      required={required}
      title="State / Province"
      ref={inputRef as React.RefObject<HTMLSelectElement>}
    >
      <option value="">Select State / Province</option>
      {options.map((label) => (
        <option key={label} value={label}>{label}</option>
      ))}
    </select>
  );
}
