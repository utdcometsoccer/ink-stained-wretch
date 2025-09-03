import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import '@testing-library/jest-dom';
import { DomainInput } from "../src/components/DomainRegistration/DomainInput";
describe("DomainInput", () => {
  it("renders input and handles change", () => {
    const handleChange = vi.fn();
    render(
      <DomainInput value="example.com" error={null} isValid={true} onChange={handleChange} />
    );
    const input = screen.getByLabelText(/Domain:/i);
    expect(input).toBeInTheDocument();
    fireEvent.change(input, { target: { value: "newdomain.com" } });
    expect(handleChange).toHaveBeenCalled();
  });

  it("shows error message", () => {
    render(
      <DomainInput value="bad" error="Invalid domain" isValid={false} onChange={() => {}} />
    );
    expect(screen.getByText(/Invalid domain/i)).toBeInTheDocument();
  });

  it("shows success message", () => {
    render(
      <DomainInput value="good.com" error={null} isValid={true} onChange={() => {}} />
    );
    expect(screen.getByText(/Domain format is valid/i)).toBeInTheDocument();
  });
});
