import type { CreateStripeCustomerResponse } from "../types/Stripe";

/**
 * Creates a Stripe customer for the given email address.
 * 
 */
export async function createStripeCustomer(emailAddress: string): Promise<CreateStripeCustomerResponse> {
    const endpoint = import.meta.env.VITE_STRIPE_CREATE_CUSTOMER_URL;
    const response = await fetch(endpoint, {
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email: emailAddress,
        }),
    });
    if (!response.ok) {
        throw new Error('Failed to create Stripe customer');
    }
    return response.json();
}

