# Stripe Checkout Integration: Azure Function Backend (.NET) & React Frontend

This guide explains how to build a secure, high-converting Stripe subscription checkout flow using:
- An Azure Function backend endpoint in .NET to create Stripe Checkout sessions
- A React frontend page to initiate checkout and redirect users

---

## 1. Azure Function Backend (.NET)

### Prerequisites
- .NET 6 or later
- Azure Functions Core Tools
- Stripe .NET SDK (`Stripe.net`)
- Your Stripe Secret Key (store securely in Azure)

### Install Stripe SDK
```sh
 dotnet add package Stripe.net
```

### Azure Function: Create Checkout Session
Create a new HTTP-triggered Azure Function:

```csharp
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Stripe.Checkout;
using Stripe;

public static class CreateCheckoutSession
{
    [FunctionName("CreateCheckoutSession")]
    public static async Task<IActionResult> Run(
        [HttpTrigger(AuthorizationLevel.Function, "post", Route = null)] HttpRequest req,
        ILogger log)
    {
        StripeConfiguration.ApiKey = Environment.GetEnvironmentVariable("STRIPE_SECRET_KEY");

        string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
        dynamic data = JsonConvert.DeserializeObject(requestBody);
        string priceId = data?.priceId;

        var options = new SessionCreateOptions
        {
            Mode = "subscription",
            LineItems = new List<SessionLineItemOptions>
            {
                new SessionLineItemOptions
                {
                    Price = priceId,
                    Quantity = 1,
                },
            },
            SuccessUrl = "https://yourdomain.com/success",
            CancelUrl = "https://yourdomain.com/cancel",
        };
        var service = new SessionService();
        Session session = await service.CreateAsync(options);
        return new OkObjectResult(new { url = session.Url });
    }
}
```

#### Notes
- Set your Stripe secret key in Azure Function App Settings (`STRIPE_SECRET_KEY`).
- Update `SuccessUrl` and `CancelUrl` to your frontend URLs.
- Deploy the function to Azure and note the endpoint URL (e.g., `/api/CreateCheckoutSession`).

---

## 2. React Checkout Page

### Prerequisites
- Stripe packages installed:
  ```sh
  npm install @stripe/stripe-js @stripe/react-stripe-js
  ```
- Your Stripe publishable key in `.env` as `VITE_STRIPE_PUBLISHABLE_KEY`

### Example React Component

```tsx
import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import type { CheckoutProps } from "./CheckoutProps";
import { State } from "../../types/State";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export const Checkout: React.FC<CheckoutProps> = ({ state }) => {
  const [loading, setLoading] = useState(false);
  const plan = state.selectedSubscriptionPlan;

  const handleCheckout = async () => {
    if (!plan?.stripePriceId) return;
    setLoading(true);
    const response = await fetch("/api/CreateCheckoutSession", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ priceId: plan.stripePriceId }),
    });
    const { url } = await response.json();
    window.location.href = url;
  };

  if (!plan) {
    return <div>Please select a subscription plan to continue.</div>;
  }

  return (
    <div className="checkout-page">
      <h1>Checkout</h1>
      <div className="plan-details">
        <h2>{plan.name}</h2>
        <p>{plan.description}</p>
        <p>
          <strong>Price:</strong> {plan.price} {plan.currency}
        </p>
      </div>
      <button
        className="checkout-btn app-btn"
        onClick={handleCheckout}
        disabled={loading}
      >
        {loading ? "Redirecting..." : "Subscribe & Pay"}
      </button>
    </div>
  );
};
```

#### Notes
- The React page calls the Azure Function endpoint to create a Stripe Checkout session.
- Stripe Checkout handles payment, conversion, and compliance.
- The user is redirected to Stripe for payment, then back to your site.

---

## 3. Best Practices for Conversion
- Show plan details and benefits clearly.
- Use a single, prominent CTA button.
- Display trust badges (Stripe logo, secure payment).
- Minimize distractions.
- Use Stripe Checkout for mobile-optimized, high-converting UI.

---

## 4. Environment Variables
- **Frontend:** `VITE_STRIPE_PUBLISHABLE_KEY`
- **Backend (Azure):** `STRIPE_SECRET_KEY`

---

## 5. References
- [Stripe Checkout Docs](https://stripe.com/docs/payments/checkout)
- [Stripe .NET SDK](https://github.com/stripe/stripe-dotnet)
- [Azure Functions Documentation](https://learn.microsoft.com/en-us/azure/azure-functions/)

---

This workflow ensures PCI compliance, security, and a high-converting payment experience for your users.
