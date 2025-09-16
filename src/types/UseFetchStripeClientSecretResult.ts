import type { CreateStripeCheckoutSessionResponse } from "./CreateStripeCheckoutSessionResponse";


export interface UseFetchStripeClientSecretResult {
	stripeClientSecret: CreateStripeCheckoutSessionResponse | null;
	error: Error | string | null;
	loading: boolean;
}
