import { describe, it, expect, vi } from 'vitest';

vi.mock('@stripe/stripe-js', () => ({
  loadStripe: vi.fn(async () => ({ mock: true })),
}));

describe('stripeClient', () => {
  it('loads stripe with publishable key', async () => {
    (import.meta as unknown as { env: Record<string, string> }).env = { VITE_STRIPE_PUBLISHABLE_KEY: 'pk_test_123' };
    const mod = await import('../src/services/stripeClient');
    expect(mod.stripePromise).toBeTruthy();
  });
});
