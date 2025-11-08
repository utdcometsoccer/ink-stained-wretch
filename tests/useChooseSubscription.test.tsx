import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useChooseSubscriptionLogic } from '../src/hooks/useChooseSubscription';
import type { State } from '../src/types/State';

vi.mock('../src/services/subscriptionApi', () => ({
  fetchSubscriptionPlans: vi.fn(async () => ({
    plans: [],
    hasMore: false,
    lastId: undefined,
  })),
}));

import { fetchSubscriptionPlans } from '../src/services/subscriptionApi';

describe('useChooseSubscriptionLogic run-once behavior', () => {
  beforeEach(() => {
    (fetchSubscriptionPlans as unknown as { mockClear: () => void }).mockClear();
  });

  it('calls fetchSubscriptionPlans only once on mount', () => {
    const state = { state: {}, currentUIState: 'chooseCulture' } as unknown as State;
    const dispatch = vi.fn();
    renderHook(() => useChooseSubscriptionLogic(state, dispatch));
    // Allow microtasks to flush (the hook uses async calls); no explicit wait here in unit test
    expect(fetchSubscriptionPlans).toHaveBeenCalledTimes(1);
  });
});
