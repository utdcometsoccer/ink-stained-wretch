import { useEffect, useState } from "react";
import { fetchStripeClientSecret } from "../services/fetchStripeClientSecret";
import type { CreateStripeCheckoutSessionRequest } from "../types/CreateStripeCheckoutSessionRequest";
import type { CreateStripeCheckoutSessionResponse } from "../types/CreateStripeCheckoutSessionResponse";
import type { UseFetchStripeClientSecretResult } from "../types/UseFetchStripeClientSecretResult";

/**
 * Data-fetching hook that requests a Stripe Checkout client secret whenever the
 * provided request changes. It manages loading and error state and returns the
 * latest response.
 */
export function useFetchStripeClientSecret(
	req: CreateStripeCheckoutSessionRequest,
	bearerToken?: string
): UseFetchStripeClientSecretResult {
	const [stripeClientSecret, setStripeClientSecret] = useState<CreateStripeCheckoutSessionResponse | null>(null);
	const [error, setError] = useState<Error | string | null>(null);
	const [loading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		let cancelled = false;

		const run = async () => {
			setLoading(true);
			setError(null);
			try {
				const res = await fetchStripeClientSecret(req, bearerToken);
				if (!cancelled) {
					setStripeClientSecret(res);
				}
			} catch (err) {
				if (!cancelled) {
					setError(err instanceof Error ? err : new Error(String(err)));
				}
			} finally {
				if (!cancelled) {
					setLoading(false);
				}
			}
		};

		run();
		return () => {
			cancelled = true;
		};
		// Track individual fields for stability and to avoid refiring on object identity changes
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [req.customerId, req.priceId, req.domain, req.active, bearerToken]);

	return { stripeClientSecret, error, loading };
}

