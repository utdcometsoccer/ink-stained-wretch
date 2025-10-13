import { describe, it, expect } from "vitest";
import { chooseCultureReducer, ChooseCultureState } from "../src/reducers/chooseCultureReducer";

describe("chooseCultureReducer", () => {
  const initialState: ChooseCultureState = {
    language: "en",
    country: "US",
    countdown: undefined,
    shouldShowCountdown: false,
    hasSubmitted: false
  };

  it("should set hasSubmitted to true when SHOW_COUNTDOWN is dispatched", () => {
    const newState = chooseCultureReducer(initialState, { type: "SHOW_COUNTDOWN" });
    
    expect(newState.shouldShowCountdown).toBe(true);
    expect(newState.hasSubmitted).toBe(true);
  });

  it("should reset language and country when RESET_STATE is dispatched", () => {
    const stateWithValues: ChooseCultureState = {
      language: "fr",
      country: "CA",
      countdown: 5,
      shouldShowCountdown: true,
      hasSubmitted: true
    };
    
    const newState = chooseCultureReducer(stateWithValues, { type: "RESET_STATE" });
    
    expect(newState.language).toBe("");
    expect(newState.country).toBe("");
    expect(newState.hasSubmitted).toBe(false);
    // countdown and shouldShowCountdown should remain unchanged by RESET_STATE
    expect(newState.countdown).toBe(5);
    expect(newState.shouldShowCountdown).toBe(true);
  });

  it("should reset countdown and shouldShowCountdown when CANCEL_COUNTDOWN is dispatched", () => {
    const stateWithCountdown: ChooseCultureState = {
      language: "en",
      country: "US",
      countdown: 5,
      shouldShowCountdown: true,
      hasSubmitted: true
    };
    
    const newState = chooseCultureReducer(stateWithCountdown, { type: "CANCEL_COUNTDOWN" });
    
    expect(newState.countdown).toBeUndefined();
    expect(newState.shouldShowCountdown).toBe(false);
    // language, country, and hasSubmitted should remain unchanged by CANCEL_COUNTDOWN
    expect(newState.language).toBe("en");
    expect(newState.country).toBe("US");
    expect(newState.hasSubmitted).toBe(true);
  });

  it("should handle SET_LANGUAGE action", () => {
    const newState = chooseCultureReducer(initialState, { 
      type: "SET_LANGUAGE", 
      payload: "es" 
    });
    
    expect(newState.language).toBe("es");
    expect(newState.country).toBe("US");
  });

  it("should handle SET_COUNTRY action", () => {
    const newState = chooseCultureReducer(initialState, { 
      type: "SET_COUNTRY", 
      payload: "MX" 
    });
    
    expect(newState.language).toBe("en");
    expect(newState.country).toBe("MX");
  });

  it("should handle SET_COUNTDOWN action", () => {
    const newState = chooseCultureReducer(initialState, { 
      type: "SET_COUNTDOWN", 
      payload: 10 
    });
    
    expect(newState.countdown).toBe(10);
  });

  it("should handle RESET_COUNTDOWN action", () => {
    const stateWithCountdown: ChooseCultureState = {
      ...initialState,
      countdown: 5
    };
    
    const newState = chooseCultureReducer(stateWithCountdown, { 
      type: "RESET_COUNTDOWN"
    });
    
    expect(newState.countdown).toBeUndefined();
  });

  it("should handle SYNC_FROM_PROPS action", () => {
    const newState = chooseCultureReducer(initialState, { 
      type: "SYNC_FROM_PROPS", 
      payload: {
        language: "fr",
        country: "FR",
        countdown: 8
      }
    });
    
    expect(newState.language).toBe("fr");
    expect(newState.country).toBe("FR");
    expect(newState.countdown).toBe(8);
  });

  it("should return unchanged state for unknown action type", () => {
    const newState = chooseCultureReducer(initialState, { type: "UNKNOWN_ACTION" } as any);
    
    expect(newState).toEqual(initialState);
  });
});
