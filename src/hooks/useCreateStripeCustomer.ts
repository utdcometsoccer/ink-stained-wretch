import { useEffect, useState } from "react";
import { createStripeCustomer } from "../services/createStripeCustomer";
import type { StripeCustomer } from "../types/Stripe";

export interface UseCreateStripeCustomerResult {
  customer: StripeCustomer | null;
  error: Error | string | null;
  loading: boolean;
}

/**
 * Data-fetching hook that creates (or retrieves) a Stripe customer for the
 * provided email when it changes. Manages loading and error state and returns
 * the latest response.
 */
export function useCreateStripeCustomer(email: string): UseCreateStripeCustomerResult {
  const [customer, setCustomer] = useState<StripeCustomer | null>(null);
  const [error, setError] = useState<Error | string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!email) {
      setCustomer(null);
      return;
    }

    let cancelled = false;

    const run = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await createStripeCustomer(email);
        if (!cancelled) setCustomer(res.customer);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [email]);

  return { customer, error, loading };
}
