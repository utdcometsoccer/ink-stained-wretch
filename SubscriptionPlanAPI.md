# Subscription Plan API Documentation

## Endpoint
`GET /api/subscription-plans/{language}/{region}`

## Description
Returns an array of available subscription plans, filtered by language and region. Each plan matches the following TypeScript interface:

```typescript
export interface SubscriptionPlan {
  label: string;
  price: number;
  duration: number;
  features: string[];
}
```

## Query Parameters
- `language` (string, optional, default: `'en'`): The user's preferred language (e.g., 'en', 'fr', 'es').
- `region` (string, optional, default: `'US'`): The user's region or country code (e.g., 'US', 'FR', 'NG').

> **Note:** If not provided, `language` defaults to `'en'` and `region` defaults to `'US'`.

## Example Request
```
GET /api/subscription-plans?language=en&region=US
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
import type { SubscriptionPlanListRequest } from "../types/SubscriptionPlanListRequest";

async function getPlans(culture?: string): Promise<SubscriptionPlan[]> {
  const request: SubscriptionPlanListRequest = {
    active: true,
    limit: 25,
    includeProductDetails: true,
    culture: culture
  };
  
  const response = await fetchSubscriptionPlans(request);
  if (response.plans.length === 0) {
    // fallback to local array
  }
  return response.plans;
}
```
