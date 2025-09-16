// src/types/stripe.ts
export interface CreateStripeCustomerResponse {
  customer: StripeCustomer;
}
export interface StripeCustomer {
  id: string;
  object: 'customer';
  address: Address | null;
  balance: number;
  created: number;
  currency: string | null;
  default_source: string | null;
  delinquent: boolean;
  description: string | null;
  discount: Discount | null;
  email: string | null;
  invoice_prefix: string;
  invoice_settings: InvoiceSettings;
  livemode: boolean;
  metadata: Record<string, string>;
  name: string | null;
  next_invoice_sequence: number;
  phone: string | null;
  preferred_locales: string[];
  shipping: Shipping | null;
  tax_exempt: 'none' | 'exempt' | 'reverse';
  tax_ids: {
    object: 'list';
    data: Array<TaxId>;
    has_more: boolean;
    url: string;
  };
}

export interface Address {
  city: string | null;
  country: string | null;
  line1: string | null;
  line2: string | null;
  postal_code: string | null;
  state: string | null;
}

export interface Discount {
  id: string;
  object: 'discount';
  checkout_session: string | null;
  coupon: Coupon;
  customer: string | null;
  end: number | null;
  invoice: string | null;
  invoice_item: string | null;
  promotion_code: string | null;
  start: number;
  subscription: string | null;
}

export interface Coupon {
  id: string;
  object: 'coupon';
  // Add other coupon fields as needed
}

export interface InvoiceSettings {
  custom_fields: null | any;
  default_payment_method: string | null;
  footer: string | null;
  rendering_options: null | any;
}

export interface Shipping {
  address: Address;
  name: string;
  phone: string | null;
}

export interface TaxId {
  id: string;
  object: 'tax_id';
  country: string;
  created: number;
  customer: string;
  livemode: boolean;
  type: string;
  value: string;
  verification: {
    status: string;
    verified_address: string | null;
    verified_name: string | null;
  } | null;
}

export type CreateSubscriptionRequest = { PriceId: string; CustomerId: string; };
export type SubscriptionCreateResponse = {
    subscriptionId: string;
    clientSecret: string;
};
