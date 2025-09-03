import { describe, it, expect, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useDomainRegistrationLogic } from "../src/components/DomainRegistration/domainRegistrationLogic";
describe("useDomainRegistrationLogic", () => {
  const mockDispatch = vi.fn();
  const baseState: any = {
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
  };

  it("returns logic and handles contact change", () => {
    const { result } = renderHook(() => useDomainRegistrationLogic(baseState, mockDispatch));
    act(() => {
      result.current.handleContactChange({ target: { name: "firstName", value: "Jane" } } as any);
    });
    expect(mockDispatch).toHaveBeenCalled();
  });

  it("handles submit with invalid domain", async () => {
    const { result } = renderHook(() => useDomainRegistrationLogic(baseState, mockDispatch));
    await act(async () => {
      await result.current.handleSubmit({ preventDefault: () => {} } as any);
    });
    expect(mockDispatch).toHaveBeenCalled();
  });
});
