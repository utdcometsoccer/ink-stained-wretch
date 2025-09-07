export interface SubscriptionPlan {
  label: string;
  price: number;
  duration: number;
  features: string[];
  stripePriceId: string;
  name: string;
  description: string;
  currency: string;
}
