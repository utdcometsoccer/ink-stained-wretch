import { useEffect, useState } from "react";
import { createSubscription } from "../services/createSubscription";
import type { CreateSubscriptionRequest, SubscriptionCreateResponse } from "../types/Stripe";

export type CreateSubscriptionFn = (
  payload: CreateSubscriptionRequest,
  bearerToken: string
) => Promise<SubscriptionCreateResponse>;

export interface UseCreateSubscriptionResult {
  subscription: SubscriptionCreateResponse | null;
  error: string | null;
  loading: boolean;
}

/**
 * Data-fetching hook that creates a Stripe subscription when `payload` changes.
 * Uses a cancel flag in useEffect to avoid setting state after unmount.
 */
export function useCreateSubscription(
  payload: CreateSubscriptionRequest | null,
  bearerToken: string,
  fetchFn: CreateSubscriptionFn = createSubscription,
): UseCreateSubscriptionResult {
  const [data, setData] = useState<SubscriptionCreateResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let cancelled = false;

    if (!payload) {
      setData(null);
      setError(null);
      setLoading(false);
      return;
    }

    if (!bearerToken || bearerToken.trim() === '') {
      setData(null);
      setError('Bearer token is required');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    fetchFn(payload, bearerToken)
      .then((res) => {
        if (!cancelled) setData(res);
      })
      .catch((err) => {
        if (!cancelled) setError(err?.message ?? String(err));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [payload, fetchFn, bearerToken]);

  return { subscription: data, error, loading };
}
