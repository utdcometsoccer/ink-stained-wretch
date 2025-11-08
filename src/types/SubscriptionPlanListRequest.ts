/**
 * Request payload for listing subscription plans/prices.
 * Mirrors the example structure provided in requestBody.
 */
export interface SubscriptionPlanListRequest {
  active?: boolean;
  productId?: string;
  currency?: 'usd';
  limit?: number;
  includeProductDetails?: boolean;
  culture?: string;
}
