import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ChooseCulture } from "../src/components/ChooseCulture";
import type { State } from "../src/types/State";

// Mock the hooks
vi.mock("../src/hooks/useChooseCulture", () => ({
  useChooseCultureLogic: vi.fn()
}));

vi.mock("../src/hooks/useLocalizationContext", () => ({
  useLocalizationContext: vi.fn()
}));

vi.mock("../src/hooks/useTrackComponent", () => ({
  useTrackComponent: vi.fn()
}));

vi.mock("../src/services/getBrowserCultureWithFallback", () => ({
  getBrowserCultureWithFallback: vi.fn(() => ({ Culture: "en-US" }))
}));

vi.mock("../src/services/getCountryInformation", () => ({
  useGetCountryInformation: vi.fn(() => ({
    getCountryInformation: vi.fn(),
    isLoading: false,
    error: null
  }))
}));

// Mock CountdownIndicator component
vi.mock("../src/components/CountdownIndicator", () => ({
  CountdownIndicator: vi.fn((props) => 
    props.showRedirect && props.countdown > 0 ? (
      <div data-testid="countdown-indicator">Countdown: {props.countdown}</div>
    ) : null
  )
}));

// Mock the country-state-selector components
vi.mock("@idahoedokpayi/react-country-state-selector", () => ({
  CultureInfo: vi.fn().mockImplementation((culture) => ({ culture })),
  CountryDropdown: vi.fn((props) => (
    <div>
      <label htmlFor="country-dropdown">{props.Label}</label>
      <select 
        id="country-dropdown"
        data-testid="country-dropdown" 
        value={props.selectedCountry} 
        onChange={(e) => props.onCountryChange(e.target.value)}
      >
        <option value="US">United States</option>
        <option value="MX">Mexico</option>
      </select>
    </div>
  )),
  LanguageDropdown: vi.fn((props) => (
    <div>
      <label htmlFor="language-dropdown">{props.Label}</label>
      <select 
        id="language-dropdown"
        data-testid="language-dropdown" 
        value={props.selectedLanguage} 
        onChange={(e) => props.onLanguageChange(e.target.value)}
      >
        <option value="en">English</option>
        <option value="es">Spanish</option>
      </select>
    </div>
  ))
}));

describe("ChooseCulture", () => {
  const mockDispatch = vi.fn();
  
  const baseState: State = {
    cultureInfo: { culture: "en-US" } as any,
    useCookies: false,
    localizationData: {
      ChooseCulture: {
        title: "Choose Your Culture",
        subtitle: "Select your language and region",
        legend: "Culture Settings",
        languageLabel: "Language",
        countryLabel: "Country",
        continue: "Continue",
        cancel: "Cancel",
        cookieConsent: "I consent to cookies",
        cookiesInfo: "We use cookies to improve your experience"
      }
    } as any
  };

  beforeEach(async () => {
    vi.clearAllMocks();
    
    const { useLocalizationContext } = await import("../src/hooks/useLocalizationContext");
    const { useChooseCultureLogic } = await import("../src/hooks/useChooseCulture");
    
    vi.mocked(useLocalizationContext).mockReturnValue({
      ChooseCulture: {
        title: "Choose Your Culture",
        subtitle: "Select your language and region",
        legend: "Culture Settings",
        languageLabel: "Language",
        countryLabel: "Country",
        continue: "Continue",
        cancel: "Cancel",
        cookieConsent: "I consent to cookies",
        cookiesInfo: "We use cookies to improve your experience"
      }
    } as any);
    
    vi.mocked(useChooseCultureLogic).mockReturnValue({
      localState: {
        language: "en",
        country: "US",
        countdown: 0,
        shouldShowCountdown: false,
        hasSubmitted: false
      },
      handleSubmit: vi.fn(),
      handleCancel: vi.fn(),
      handleLanguageChange: vi.fn(),
      handleCountryChange: vi.fn(),
      handleCookieConsentChange: vi.fn(),
      countdownRef: { current: null }
    });
  });

  it("shows countdown indicator and disables continue button when countdown is active", async () => {
    const { useChooseCultureLogic } = await import("../src/hooks/useChooseCulture");
    
    // Mock with countdown active
    vi.mocked(useChooseCultureLogic).mockReturnValue({
      localState: {
        language: "en",
        country: "US",
        countdown: 5,
        shouldShowCountdown: true,
        hasSubmitted: true
      },
      handleSubmit: vi.fn(),
      handleCancel: vi.fn(),
      handleLanguageChange: vi.fn(),
      handleCountryChange: vi.fn(),
      handleCookieConsentChange: vi.fn(),
      countdownRef: { current: null }
    });

    render(<ChooseCulture state={baseState} dispatch={mockDispatch} />);

    // Should show countdown
    expect(screen.getByTestId("countdown-indicator")).toBeDefined();
    
    // Continue button should be disabled
    const continueButton = screen.getByText("Continue");
    expect(continueButton.hasAttribute("disabled")).toBe(true);
    
    // Cancel button should be enabled
    const cancelButton = screen.getByText("Cancel");
    expect(cancelButton.hasAttribute("disabled")).toBe(false);
  });

  it("enables continue button when no countdown", () => {
    render(<ChooseCulture state={baseState} dispatch={mockDispatch} />);

    const continueButton = screen.getByText("Continue");
    expect(continueButton.hasAttribute("disabled")).toBe(false);
    
    // No countdown indicator should be present
    expect(screen.queryByTestId("countdown-indicator")).toBeNull();
  });

  it("enables cancel button when countdown is active", async () => {
    const { useChooseCultureLogic } = await import("../src/hooks/useChooseCulture");
    
    // Mock state with active countdown
    vi.mocked(useChooseCultureLogic).mockReturnValue({
      localState: {
        language: "en",
        country: "US",
        countdown: 3,
        shouldShowCountdown: true,
        hasSubmitted: true
      },
      handleSubmit: vi.fn(),
      handleCancel: vi.fn(),
      handleLanguageChange: vi.fn(),
      handleCountryChange: vi.fn(),
      handleCookieConsentChange: vi.fn(),
      countdownRef: { current: null }
    });

    render(<ChooseCulture state={baseState} dispatch={mockDispatch} />);

    const cancelButton = screen.getByText("Cancel");
    expect(cancelButton.hasAttribute('disabled')).toBe(false);
    
    // Test cancel functionality
    fireEvent.click(cancelButton);
    expect(vi.mocked(useChooseCultureLogic).mock.results[0].value.handleCancel).toHaveBeenCalled();
  });

  it("renders form elements correctly", () => {
    render(<ChooseCulture state={baseState} dispatch={mockDispatch} />);

    // Check that all form elements are rendered
    expect(screen.getByText("Choose Your Culture")).toBeDefined();
    expect(screen.getByText("Select your language and region")).toBeDefined();
    expect(screen.getByText("Culture Settings")).toBeDefined();
    expect(screen.getByTestId("language-dropdown")).toBeDefined();
    expect(screen.getByTestId("country-dropdown")).toBeDefined();
    expect(screen.getByText("Continue")).toBeDefined();
    expect(screen.getByText("Cancel")).toBeDefined();
    expect(screen.getByLabelText("I consent to cookies")).toBeDefined();
  });
});