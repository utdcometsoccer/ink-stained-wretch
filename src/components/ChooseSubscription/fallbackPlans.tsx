import type { SubscriptionPlan } from "../../types/SubscriptionPlan";

export const fallbackPlans: SubscriptionPlan[] = [
  {
    id: "plan_1_year",
    label: "1 Year Subscription",
    price: 59,
    duration: 1,
    features: ["Image hosting for up to 20 images", "Full access to all features", "Priority support"],
    stripePriceId: "",
    name: "1 Year Subscription",
    description: "Access to all features for 1 year",
    currency: "USD"
  },
  {
    id: "plan_2_year",
    label: "2 Year Subscription",
    price: 99,
    duration: 2,
    features: ["Image hosting for up to 20 images", "Full access to all features", "Priority support"],
    stripePriceId: "",
    name: "2 Year Subscription",
    description: "Access to all features for 2 years",
    currency: "USD"
  },
  {
    id: "plan_3_year",
    label: "3 Year Subscription",
    price: 149,
    duration: 3,
    features: ["Image hosting for up to 20 images", "Full access to all features", "Priority support"],
    stripePriceId: "",
    name: "3 Year Subscription",
    description: "Access to all features for 3 years",
    currency: "USD"
  },
];
