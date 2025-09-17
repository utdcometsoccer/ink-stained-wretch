import { CircularProgress } from '@mui/material';
import {
    CardElement,
    useElements,
    useStripe,
} from '@stripe/react-stripe-js';
import { useEffect, useState, type FC } from 'react';
import { useLocalizationContext } from '../../hooks/useLocalizationContext';
import { trackEvent, } from '../../services/applicationInsights';
import { formatError } from '../../services/formatError';
export interface CheckoutFormProps {
    name: string;
    clientSecret: string;
    handleSuccess: () => void;
}
export const CheckoutForm: FC<CheckoutFormProps> = ({ name, clientSecret, handleSuccess }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [paymentError, setPaymentError] = useState<unknown | Error | string | null>(null);
    const localized = useLocalizationContext().Checkout;
    const handlePaymentError = (error: unknown) => {
        console.error("Payment confirmation error:", error);
        setPaymentError(error);
        trackEvent('PaymentError', {error: formatError(error)});
    }

    useEffect(() => {
        if (!stripe || !elements) {
            setIsLoading(true);
        }
        else {
            setIsLoading(false);
        }
    }, [stripe, elements]);

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setPaymentError(null);

        try {
            if (!stripe || !elements) {
                throw new Error("Stripe.js has not yet loaded.");
            }
            const cardElement = elements.getElement(CardElement);
            const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: cardElement!,
                    billing_details: { name }
                }
            });
            if (error) {
                handlePaymentError(error);
            } else if (paymentIntent && paymentIntent.status === 'succeeded') {
                // Set UI state to thankYou
                handleSuccess();
            }
        } catch (error) {
            handlePaymentError(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <h2>{localized.formTitle}</h2>
                {/* Payment Element */}
                <div id="payment-element">
                    <CardElement />
                </div>
                {/* Error message */}
                {paymentError != null && (
                    <div className="error-message">
                        {localized.errorMessage} {formatError(paymentError)}
                    </div>
                )}
                {/* Submit button */}
                <button className="app-btn" type='submit' disabled={isLoading}>
                    {isLoading ? (
                        <CircularProgress size={24} className="checkout-spinner" />
                    ) : localized.buttonLabel}
                </button>
            </div>
        </form>
    );
}


