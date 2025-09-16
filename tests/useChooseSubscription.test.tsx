import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useChooseSubscriptionLogic } from '../src/hooks/useChooseSubscription';

vi.mock('../src/services/subscriptionApi', () => ({
  fetchSubscriptionPlans: vi.fn(async () => ({
    plans: [],
    hasMore: false,
    lastId: undefined,
  })),
}));

const { fetchSubscriptionPlans } = require('../src/services/subscriptionApi');

describe('useChooseSubscriptionLogic run-once behavior', () => {
  beforeEach(() => {
    (fetchSubscriptionPlans as any).mockClear();
  });

  it('calls fetchSubscriptionPlans only once on mount', () => {
    const state = { state: {}, currentUIState: 'chooseCulture' } as any;
    const dispatch = vi.fn();
    renderHook(() => useChooseSubscriptionLogic(state, dispatch));
    // Allow microtasks to flush (the hook uses async calls); no explicit wait here in unit test
    expect(fetchSubscriptionPlans).toHaveBeenCalledTimes(1);
  });
});
