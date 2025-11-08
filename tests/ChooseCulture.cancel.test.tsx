import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { ChooseCulture } from "../src/components/ChooseCulture";
import { State } from "../src/types/State";
import { CultureInfo } from "@idahoedokpayi/react-country-state-selector";
import type { LocalizedText } from "../src/types/LocalizedText";

// Mock the hooks
vi.mock("../src/hooks/useChooseCulture", () => ({
  useChooseCultureLogic: vi.fn()
}));

vi.mock("../src/hooks/useLocalizationContext", () => ({
  useLocalizationContext: vi.fn()
}));

// Mock CountdownIndicator as a simple component
vi.mock("../src/components/CountdownIndicator", () => ({
  CountdownIndicator: vi.fn(({ countdown }) => 
    countdown > 0 ? <div data-testid="countdown">Countdown: {countdown}</div> : null
  )
}));

describe("ChooseCulture Cancel Button", () => {
  const mockDispatch = vi.fn();
  const mockHandleCancel = vi.fn();

  beforeEach(async () => {
    vi.clearAllMocks();
    
    const useLocalizationContext = (await import("../src/hooks/useLocalizationContext")).useLocalizationContext;
    
    vi.mocked(useLocalizationContext).mockReturnValue({
      ChooseCulture: {
        title: "Choose Your Language",
        subtitle: "subtitle",
        legend: "legend",
        languageLabel: "Language",
        countryLabel: "Country",
        continue: "Continue", 
        cancel: "Cancel",
        cookieConsent: "Cookie Consent",
        cookiesInfo: "Cookies Info"
      }
    } as unknown as LocalizedText);
  });

  it("should be disabled on initial load when no culture is selected", async () => {
    const { useChooseCultureLogic } = await import("../src/hooks/useChooseCulture");
    
    vi.mocked(useChooseCultureLogic).mockReturnValue({
      localState: {
        language: "",
        country: "",
        countdown: undefined,
        shouldShowCountdown: false,
        hasSubmitted: false
      },
      handleSubmit: vi.fn(),
      handleCancel: mockHandleCancel,
      handleLanguageChange: vi.fn(),
      handleCountryChange: vi.fn(),
      handleCookieConsentChange: vi.fn(),
      countdownRef: { current: null }
    });

    const baseState: State = {
      cultureInfo: undefined,
      useCookies: false,
      localizationData: null
    } as Record<string, unknown>;

    render(<ChooseCulture state={baseState} dispatch={mockDispatch} />);

    const cancelButton = screen.getByText("Cancel");
    expect(cancelButton.hasAttribute("disabled")).toBe(true);
  });

  it("should be disabled when no valid culture in global state", async () => {
    const { useChooseCultureLogic } = await import("../src/hooks/useChooseCulture");
    
    vi.mocked(useChooseCultureLogic).mockReturnValue({
      localState: {
        language: "en",
        country: "US",
        countdown: undefined,
        shouldShowCountdown: false,
        hasSubmitted: false
      },
      handleSubmit: vi.fn(),
      handleCancel: mockHandleCancel,
      handleLanguageChange: vi.fn(),
      handleCountryChange: vi.fn(),
      handleCookieConsentChange: vi.fn(),
      countdownRef: { current: null }
    });

    const baseState: State = {
      cultureInfo: undefined, // No valid culture in global state
      useCookies: false,
      localizationData: null
    } as Record<string, unknown>;

    render(<ChooseCulture state={baseState} dispatch={mockDispatch} />);

    const cancelButton = screen.getByText("Cancel");
    expect(cancelButton.hasAttribute("disabled")).toBe(true);
  });

  it("should be disabled when no valid culture in local state", async () => {
    const { useChooseCultureLogic } = await import("../src/hooks/useChooseCulture");
    
    vi.mocked(useChooseCultureLogic).mockReturnValue({
      localState: {
        language: "", // No valid language in local state
        country: "",  // No valid country in local state
        countdown: undefined,
        shouldShowCountdown: false,
        hasSubmitted: false
      },
      handleSubmit: vi.fn(),
      handleCancel: mockHandleCancel,
      handleLanguageChange: vi.fn(),
      handleCountryChange: vi.fn(),
      handleCookieConsentChange: vi.fn(),
      countdownRef: { current: null }
    });

    const baseState: State = {
      cultureInfo: new CultureInfo("en-US"),
      useCookies: false,
      localizationData: null
    } as Record<string, unknown>;

    render(<ChooseCulture state={baseState} dispatch={mockDispatch} />);

    const cancelButton = screen.getByText("Cancel");
    expect(cancelButton.hasAttribute("disabled")).toBe(true);
  });

  it("should be enabled when countdown is active and all culture info is valid", async () => {
    const { useChooseCultureLogic } = await import("../src/hooks/useChooseCulture");
    
    vi.mocked(useChooseCultureLogic).mockReturnValue({
      localState: {
        language: "en",
        country: "US",
        countdown: 5,
        shouldShowCountdown: true,
        hasSubmitted: true
      },
      handleSubmit: vi.fn(),
      handleCancel: mockHandleCancel,
      handleLanguageChange: vi.fn(),
      handleCountryChange: vi.fn(),
      handleCookieConsentChange: vi.fn(),
      countdownRef: { current: null }
    });

    const baseState: State = {
      cultureInfo: new CultureInfo("en-US"),
      useCookies: false,
      localizationData: null
    } as Record<string, unknown>;

    render(<ChooseCulture state={baseState} dispatch={mockDispatch} />);

    const cancelButton = screen.getByText("Cancel");
    expect(cancelButton.hasAttribute("disabled")).toBe(false);
  });

  it("should be disabled after countdown finishes even though hasSubmitted is true", async () => {
    const { useChooseCultureLogic } = await import("../src/hooks/useChooseCulture");
    
    vi.mocked(useChooseCultureLogic).mockReturnValue({
      localState: {
        language: "en",
        country: "US",
        countdown: 0,
        shouldShowCountdown: false, // Countdown finished
        hasSubmitted: true
      },
      handleSubmit: vi.fn(),
      handleCancel: mockHandleCancel,
      handleLanguageChange: vi.fn(),
      handleCountryChange: vi.fn(),
      handleCookieConsentChange: vi.fn(),
      countdownRef: { current: null }
    });

    const baseState: State = {
      cultureInfo: new CultureInfo("en-US"),
      useCookies: false,
      localizationData: null
    } as Record<string, unknown>;

    render(<ChooseCulture state={baseState} dispatch={mockDispatch} />);

    const cancelButton = screen.getByText("Cancel");
    expect(cancelButton.hasAttribute("disabled")).toBe(true);
  });

  it("should be disabled when hasSubmitted is false even with valid cultures", async () => {
    const { useChooseCultureLogic } = await import("../src/hooks/useChooseCulture");
    
    vi.mocked(useChooseCultureLogic).mockReturnValue({
      localState: {
        language: "en",
        country: "US",
        countdown: undefined,
        shouldShowCountdown: false,
        hasSubmitted: false // Continue has not been clicked
      },
      handleSubmit: vi.fn(),
      handleCancel: mockHandleCancel,
      handleLanguageChange: vi.fn(),
      handleCountryChange: vi.fn(),
      handleCookieConsentChange: vi.fn(),
      countdownRef: { current: null }
    });

    const baseState: State = {
      cultureInfo: new CultureInfo("en-US"),
      useCookies: false,
      localizationData: null
    } as Record<string, unknown>;

    render(<ChooseCulture state={baseState} dispatch={mockDispatch} />);

    const cancelButton = screen.getByText("Cancel");
    expect(cancelButton.hasAttribute("disabled")).toBe(true);
  });

  it("should enable Continue button when countdown is not active", async () => {
    const { useChooseCultureLogic } = await import("../src/hooks/useChooseCulture");
    
    vi.mocked(useChooseCultureLogic).mockReturnValue({
      localState: {
        language: "en",
        country: "US",
        countdown: undefined,
        shouldShowCountdown: false,
        hasSubmitted: false
      },
      handleSubmit: vi.fn(),
      handleCancel: mockHandleCancel,
      handleLanguageChange: vi.fn(),
      handleCountryChange: vi.fn(),
      handleCookieConsentChange: vi.fn(),
      countdownRef: { current: null }
    });

    const baseState: State = {
      cultureInfo: new CultureInfo("en-US"),
      useCookies: false,
      localizationData: null
    } as Record<string, unknown>;

    render(<ChooseCulture state={baseState} dispatch={mockDispatch} />);

    const continueButton = screen.getByText("Continue");
    expect(continueButton.hasAttribute("disabled")).toBe(false);
  });

  it("should disable Continue button when countdown is active", async () => {
    const { useChooseCultureLogic } = await import("../src/hooks/useChooseCulture");
    
    vi.mocked(useChooseCultureLogic).mockReturnValue({
      localState: {
        language: "en",
        country: "US",
        countdown: 5,
        shouldShowCountdown: true,
        hasSubmitted: true
      },
      handleSubmit: vi.fn(),
      handleCancel: mockHandleCancel,
      handleLanguageChange: vi.fn(),
      handleCountryChange: vi.fn(),
      handleCookieConsentChange: vi.fn(),
      countdownRef: { current: null }
    });

    const baseState: State = {
      cultureInfo: new CultureInfo("en-US"),
      useCookies: false,
      localizationData: null
    } as Record<string, unknown>;

    render(<ChooseCulture state={baseState} dispatch={mockDispatch} />);

    const continueButton = screen.getByText("Continue");
    expect(continueButton.hasAttribute("disabled")).toBe(true);
  });
});
