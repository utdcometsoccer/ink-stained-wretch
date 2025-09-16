import type { SubscriptionPlan } from "./SubscriptionPlan";

export interface SubscriptionPlanListResponse {
  plans: SubscriptionPlan[];
  hasMore: boolean;
  lastId: string;
}
