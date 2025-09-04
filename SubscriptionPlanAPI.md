# Subscription Plan API Documentation

## Endpoint
`GET /api/subscription-plans`

## Description
Returns an array of available subscription plans. Each plan matches the following TypeScript interface:

```typescript
export interface SubscriptionPlan {
  label: string;
  price: number;
  duration: number;
  features: string[];
}
```

## Example Response
```json
[
  {
    "label": "1 Year Subscription",
    "price": 59,
    "duration": 1,
    "features": [
      "Image hosting for up to 20 images",
      "Full access to all features",
      "Priority support"
    ]
  },
  {
    "label": "2 Year Subscription",
    "price": 99,
    "duration": 2,
    "features": [
      "Image hosting for up to 20 images",
      "Full access to all features",
      "Priority support"
    ]
  },
  {
    "label": "3 Year Subscription",
    "price": 149,
    "duration": 3,
    "features": [
      "Image hosting for up to 20 images",
      "Full access to all features",
      "Priority support"
    ]
  }
]
```

## Error Handling
If the API request fails, the client should fallback to a local array of subscription plans.

## Usage Example (TypeScript)
```typescript
import { fetchSubscriptionPlans } from "../services/subscriptionApi";
import type { SubscriptionPlan } from "../types/SubscriptionPlan";

async function getPlans(): Promise<SubscriptionPlan[]> {
  const plans = await fetchSubscriptionPlans();
  if (plans.length === 0) {
    // fallback to local array
  }
  return plans;
}
```
