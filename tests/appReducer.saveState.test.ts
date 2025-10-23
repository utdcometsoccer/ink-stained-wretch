import { describe, it, expect, vi, beforeEach } from 'vitest';
import { appReducer } from '../src/reducers/appReducer';
import type { AppState } from '../src/types/AppState';
import { saveStateToCookie } from '../src/services/saveStateToCookie';

vi.mock('../src/services/saveStateToCookie', () => ({
  saveStateToCookie: vi.fn(),
}));

describe('appReducer saveState side-effect', () => {
  const baseState: AppState = {
    currentUIState: 'chooseCulture',
    state: {},
  };

  beforeEach(() => {
    vi.mocked(saveStateToCookie).mockClear();
  });

  it('calls saveStateToCookie on every reduction with updated state', () => {
    const next = appReducer(baseState, { type: 'UPDATE_STATE', payload: { isAuthenticated: true } });
    expect(saveStateToCookie).toHaveBeenCalledTimes(1);
    const arg = vi.mocked(saveStateToCookie).mock.calls[0][0];
    expect(arg).toMatchObject({ isAuthenticated: true });
    expect(next.state.isAuthenticated).toBe(true);
  });
});
