import { describe, it, expect } from "vitest";
import { appReducer } from '../src/reducers/appReducer';
import type { Action, AppState } from '../src/reducers/appReducer';

const initialState: AppState = {
        currentUIState: 'chooseCulture',
        state: {
        }
    };
describe('appReducer', () => {
  it('should set UI state', () => {
    const action: Action = { type: 'SET_UI_STATE', payload: 'authorPage' };
    const result = appReducer(initialState, action);
    expect(result.currentUIState).toBe('authorPage');
  });

  it('should set error', () => {
    const action: Action = { type: 'SET_ERROR', payload: 'Test error' };
    const result = appReducer(initialState, action);
    expect(result.state.error).toBe('Test error');
    expect(result.currentUIState).toBe('error');
  });

  it('should clear error', () => {
    const stateWithError = { ...initialState, state: { ...initialState.state, error: 'Test error' } };
    const action: Action = { type: 'CLEAR_ERROR' };
    const result = appReducer(stateWithError, action);
    expect(result.state.error).toBeUndefined();
  });

  it('should update state', () => {
    const action: Action = { type: 'UPDATE_STATE', payload: { isAuthenticated: true } };
    const result = appReducer(initialState, action);
    expect(result.state.isAuthenticated).toBe(true);
  });
});
