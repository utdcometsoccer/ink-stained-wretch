export type CreateStripeCheckoutSessionRequest = {
  domain?: string;
  customerId: string;
  priceId: string;
};