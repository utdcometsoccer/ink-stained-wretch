import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { ChooseCulture } from "../src/components/ChooseCulture";
import { State } from "../src/types/State";
import { CultureInfo } from "@idahoedokpayi/react-country-state-selector";

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

describe("ChooseCulture", () => {
  const mockDispatch = vi.fn();
  
  const baseState: State = {
    cultureInfo: new CultureInfo("en-US"),
    useCookies: false,
    localizationData: null
  } as any;

  beforeEach(async () => {
    vi.clearAllMocks();
    
    const useLocalizationContext = (await import("../src/hooks/useLocalizationContext")).useLocalizationContext;
    const { useChooseCultureLogic } = await import("../src/hooks/useChooseCulture");
    
    vi.mocked(useLocalizationContext).mockReturnValue({
      ChooseCulture: {
        title: "Choose Your Language",
        continue: "Continue", 
        cancel: "Cancel"
      }
    } as any);
    
    vi.mocked(useChooseCultureLogic).mockReturnValue({
      localState: {
        language: "en",
        country: "US",
        countdown: 0,
        shouldShowCountdown: false
      },
      handleSubmit: vi.fn(),
      handleCancel: vi.fn(),
      handleLanguageChange: vi.fn(),
      handleCountryChange: vi.fn(),
      handleCookieConsentChange: vi.fn(),
      countdownRef: { current: null }
    });
  });

  it("shows countdown and disables continue button during countdown", async () => {
    const { useChooseCultureLogic } = await import("../src/hooks/useChooseCulture");
    
    // Mock with countdown active
    vi.mocked(useChooseCultureLogic).mockReturnValue({
      localState: {
        language: "en",
        country: "US", 
        countdown: 3,
        shouldShowCountdown: true
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
    expect(screen.getByTestId("countdown")).toBeDefined();
    
    // Continue button should be disabled
    const continueButton = screen.getByText("Continue");
    expect(continueButton.hasAttribute("disabled")).toBe(true);
  });

  it("enables continue button when no countdown", () => {
    render(<ChooseCulture state={baseState} dispatch={mockDispatch} />);

    const continueButton = screen.getByText("Continue");
    expect(continueButton.hasAttribute("disabled")).toBe(false);
  });
});