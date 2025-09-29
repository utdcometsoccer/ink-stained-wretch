import type { CreateStripeCustomerResponse } from "../types/Stripe";

/**
 * Creates a Stripe customer for the given email address.
 * 
 */
export async function createStripeCustomer(emailAddress: string, bearerToken?: string): Promise<CreateStripeCustomerResponse> {
    const endpoint = import.meta.env.VITE_STRIPE_CREATE_CUSTOMER_URL;
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };
    if (bearerToken) {
        headers['Authorization'] = `Bearer ${bearerToken}`;
    }
    const response = await fetch(endpoint, {
        method: 'post',
        headers,
        body: JSON.stringify({
            email: emailAddress,
        }),
    });
    if (!response.ok) {
        throw new Error('Failed to create Stripe customer');
    }
    return response.json();
}

