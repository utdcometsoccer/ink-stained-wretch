import { describe, it, expect, vi, beforeEach } from 'vitest';
import { appReducer } from '../src/reducers/appReducer';
import type { AppState } from '../src/types/AppState';

vi.mock('../src/services/saveStateToCookie', () => ({
  saveStateToCookie: vi.fn(),
}));

const { saveStateToCookie } = require('../src/services/saveStateToCookie');

describe('appReducer saveState side-effect', () => {
  const baseState: AppState = {
    currentUIState: 'chooseCulture',
    state: {},
  };

  beforeEach(() => {
    (saveStateToCookie as any).mockClear();
  });

  it('calls saveStateToCookie on every reduction with updated state', () => {
    const next = appReducer(baseState, { type: 'UPDATE_STATE', payload: { isAuthenticated: true } });
    expect(saveStateToCookie).toHaveBeenCalledTimes(1);
    const arg = (saveStateToCookie as any).mock.calls[0][0];
    expect(arg).toMatchObject({ isAuthenticated: true });
    expect(next.state.isAuthenticated).toBe(true);
  });
});
