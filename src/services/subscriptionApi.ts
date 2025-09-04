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


import axios from "axios";
import type { SubscriptionPlan } from "../types/SubscriptionPlan";

const SUBSCRIPTION_PLANS_API_URL = import.meta.env.VITE_SUBSCRIPTION_PLANS_API_URL;

export async function fetchSubscriptionPlans(): Promise<SubscriptionPlan[]> {
  const response = await axios.get<SubscriptionPlan[]>(SUBSCRIPTION_PLANS_API_URL);
  if (
    response.status !== 200 ||
    !Array.isArray(response.data) ||
    response.data.length === 0
  ) {
    throw new Error(`Failed to fetch valid subscription plans: ${response.status} ${response.statusText}`);
  }
  return response.data;
}
