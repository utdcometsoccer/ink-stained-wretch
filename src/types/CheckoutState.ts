export interface CheckoutState {
  status: string;
  paymentIntentId?: string;
  paymentStatus?: string;
  paymentIntentStatus?: string;
}