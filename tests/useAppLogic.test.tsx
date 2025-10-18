import { renderHook, act, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, MockedFunction } from 'vitest';
import { useAppLogic } from '../src/hooks/useAppLogic';
import {
  initializeAppInsights,
  trackEvent,
  trackException,
  trackPageView,
} from '../src/services/applicationInsights';

vi.mock('../src/services/applicationInsights', () => ({
  initializeAppInsights: vi.fn(),
  trackEvent: vi.fn(),
  trackException: vi.fn(),
  trackPageView: vi.fn(),
}));

vi.mock('../src/services/loadStateFromCookie', () => ({
  loadStateFromCookie: vi.fn(() => ({
    currentUIState: 'chooseCulture',
    state: {
      Authors: [],
      cultureInfo: { Culture: 'en-us' },
      localizationDataLoaded: false,
      loading: false,
    },
  })),
}));

vi.mock('../src/services/localization', () => ({
  getLocalizedText: vi.fn(() => Promise.resolve({
    Checkout: { selectPlan: 'Select a plan' }
  })),
}));

vi.mock('../src/services/getDefaultLocale', () => ({
  getDefaultLocale: vi.fn(() => ({
    Checkout: { selectPlan: 'Select a plan' }
  })),
}));

describe('useAppLogic', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('initializes and returns state, dispatch, localized, loading, and handler', async () => {
    const { result } = renderHook(() => useAppLogic());
    
    // Initial state
    expect(result.current).toHaveProperty('appState');
    expect(result.current).toHaveProperty('dispatch');
    expect(result.current).toHaveProperty('localized');
    expect(result.current).toHaveProperty('loading');
    expect(result.current).toHaveProperty('handleReactError');
    
    // Wait for async localization loading to complete
    await waitFor(() => {
      expect(result.current.loading).toBeFalsy();
    });
    
    expect(result.current.localized).toBeTruthy();
    expect(initializeAppInsights).toHaveBeenCalled();
    expect(trackEvent).toHaveBeenCalled();
    expect(trackPageView).toHaveBeenCalled();
  });

  it('dispatches error when handleReactError is called', () => {
    const { result } = renderHook(() => useAppLogic());
    act(() => {
      result.current.handleReactError(new Error('boom'));
    });
    // After error, app moves to error state per reducer
    expect(result.current.appState.currentUIState).toBe('error');
    expect(result.current.appState.state.error).toBe('boom');
    expect(trackException).toHaveBeenCalled();
  });

  it('tracks page view when UI state changes', () => {
    const { result } = renderHook(() => useAppLogic());
    act(() => {
      result.current.dispatch({ type: 'SET_UI_STATE', payload: 'login' });
    });
    const calls = (trackPageView as unknown as { mock: { calls: any[] } }).mock.calls;
    const hasLogin = calls.some((args) => String(args[0]).includes('login'));
    expect(hasLogin).toBe(true);
  });

  it('handles window error events', async () => {
    const { result } = renderHook(() => useAppLogic());
    await act(async () => {
      window.dispatchEvent(new ErrorEvent('error', { error: new Error('oops') }));
      await Promise.resolve();
    });
    expect(result.current.appState.currentUIState).toBe('error');
    expect(result.current.appState.state.error).toBe('oops');
  });

  it('handles unhandledrejection events', async () => {
    const { result } = renderHook(() => useAppLogic());
    await act(async () => {
      // Some environments may not have PromiseRejectionEvent; fallback to simple object event
      try {
        const evt = new PromiseRejectionEvent('unhandledrejection', { reason: new Error('reject') } as any);
        window.dispatchEvent(evt);
      } catch {
        // Fallback custom event
        const evt = new CustomEvent('unhandledrejection', { detail: { reason: new Error('reject') } });
        (evt as any).reason = new Error('reject');
        window.dispatchEvent(evt as any);
      }
      await Promise.resolve();
    });
    expect(result.current.appState.currentUIState).toBe('error');
    expect(String(result.current.appState.state.error)).toContain('reject');
  });

  it('initializes properly with localization', async () => {
    const { result } = renderHook(() => useAppLogic());
    
    // Wait for localization to complete
    await waitFor(() => {
      expect(result.current.appState.state.localizationDataLoaded).toBe(true);
    });
    
    expect(result.current.appState.currentUIState).toBe('chooseCulture');
    expect(result.current.appState.state.error).toBeUndefined();
    expect(result.current.localized).toBeTruthy();
  });
});
