/**
 * Subscription Plans API
 *
 * GET /api/subscription-plans
 * Returns an array of subscription plans matching the SubscriptionPlan interface:
 * [
 *   {
 *     label: string,
 *     price: number,
 *     duration: number,
 *     features: string[]
 *   },
 *   ...
 * ]
 *
 * Example response:
 * [
 *   {
 *     label: "1 Year Subscription",
 *     price: 59,
 *     duration: 1,
 *     features: ["Image hosting for up to 20 images", "Full access to all features", "Priority support"]
 *   },
 *   ...
 * ]
 */
import type { SubscriptionPlan } from "../types/SubscriptionPlan";

const SUBSCRIPTION_PLANS_API_URL = import.meta.env.VITE_SUBSCRIPTION_PLANS_API_URL;

export async function fetchSubscriptionPlans(language: string = 'en', region: string = 'US'): Promise<SubscriptionPlan[]> {
  // Build the API URL according to documentation: /api/subscription-plans/{language}/{region}
  const url = `${SUBSCRIPTION_PLANS_API_URL}/${language}/${region}`;
  const response = await fetch(url);
  if (response.status !== 200) {
    throw new Error(`Failed to fetch valid subscription plans: ${response.status} ${response.statusText}`);
  }
  const data = await response.json();
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error(`Failed to fetch valid subscription plans: ${response.status} ${response.statusText}`);
  }
  return data;
}
