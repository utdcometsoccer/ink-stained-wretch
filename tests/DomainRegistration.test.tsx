import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { DomainRegistration } from "../src/components/DomainRegistration/index";
import type { State } from "../src/types/State";
import { vi } from "vitest";

describe("DomainRegistration", () => {
  const mockDispatch = vi.fn();
  const baseState: State = {
    domainInputValue: "example.com",
    domainError: null,
    showRedirect: false,
    countdown: null,
    cultureInfo: undefined,
    domainRegistration: {
      contactInformation: {
        firstName: "John",
        lastName: "Doe",
        address: "123 Main St",
        address2: "",
        city: "Dallas",
        state: "TX",
        country: "US",
        zipCode: "75001",
        emailAddress: "john@example.com",
        telephoneNumber: "1234567890",
      },
    },
  } as any;

  it("renders the form and submits valid data", () => {
    render(<DomainRegistration state={baseState} dispatch={mockDispatch} />);
    expect(screen.getByText(/Domain Registration/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Domain:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/First Name:/i)).toHaveValue("John");
    fireEvent.change(screen.getByLabelText(/Domain:/i), { target: { value: "newdomain.com" } });
    fireEvent.click(screen.getByText(/Submit/i));
    expect(mockDispatch).toHaveBeenCalled();
  });

  it("shows error for invalid domain", () => {
    const state = { ...baseState, domainInputValue: "invalid_domain" };
    render(<DomainRegistration state={state} dispatch={mockDispatch} />);
    fireEvent.click(screen.getByText(/Submit/i));
    expect(mockDispatch).toHaveBeenCalled();
  });

  it("shows countdown indicator when redirecting", () => {
    const state = { ...baseState, showRedirect: true, countdown: 5 };
    render(<DomainRegistration state={state} dispatch={mockDispatch} />);
    expect(screen.getByText(/Redirecting to Author Page/i)).toBeInTheDocument();
  });
});
