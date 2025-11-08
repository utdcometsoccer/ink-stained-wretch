import type { SubscriptionPlanListRequest } from "../types/SubscriptionPlanListRequest";
import type { SubscriptionPlanListResponse } from "../types/SubscriptionPlanListResponse";
import { UnauthorizedError } from "../types/UnauthorizedError";

/**
 * Subscription Plans API
 *
 * GET /api/subscription-plans
 * Returns an array of subscription plans matching the SubscriptionPlan interface:
 * 
 */

const SUBSCRIPTION_PLANS_API_URL = import.meta.env.VITE_SUBSCRIPTION_PLANS_API_URL;

export async function fetchSubscriptionPlans(requestBody: SubscriptionPlanListRequest, bearerToken?: string): Promise<SubscriptionPlanListResponse> {
  
  
  const headers: Record<string, string> = { "content-type": "application/json" };
  if (bearerToken) headers["Authorization"] = `Bearer ${bearerToken}`;
  const response = await fetch(SUBSCRIPTION_PLANS_API_URL, {
    method: "POST",
    headers,
    body: JSON.stringify({
      active: requestBody.active ?? true,
      productId: requestBody.productId ?? undefined,
      currency: requestBody.currency ?? 'usd',
      limit: requestBody.limit ?? 25,
      includeProductDetails: requestBody.includeProductDetails ?? true,
      culture: requestBody.culture ?? undefined,
    })
  });
  if (response.status === 401) {
    throw new UnauthorizedError();
  }
  if (response.status !== 200) {
    throw new Error(`Failed to fetch valid subscription plans: ${response.status} ${response.statusText}`);
  }
  return await response.json();
}
