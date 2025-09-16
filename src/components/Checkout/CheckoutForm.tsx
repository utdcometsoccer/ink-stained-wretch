import { CircularProgress } from '@mui/material';
import {
    CardElement,
    useElements,
    useStripe,
} from '@stripe/react-stripe-js';
import { useEffect, useState, type FC } from 'react';
import { formatError } from '../../services/formatError';
import { trackEvent,  } from '../../services/applicationInsights';
export interface CheckoutFormProps {
    name: string;
    clientSecret: string;
}
export const CheckoutForm: FC<CheckoutFormProps> = ({ name, clientSecret }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [paymentError, setPaymentError] = useState<unknown | Error | string | null>(null);
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
            const { error } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: cardElement!,
                    billing_details: { name }
                }
            });
            if (error) {
                handlePaymentError(error);
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
                <h2>Complete your purchase</h2>

                {/* Payment Element */}
                <div id="payment-element">
                    <CardElement />
                </div>

                {/* Error message */}
                {paymentError != null && (
                    <div className="error-message">
                        {formatError(paymentError)}
                    </div>
                )}

                {/* Submit button */}
                <button type='submit' disabled={isLoading}>
                    {isLoading ? <CircularProgress size={24} /> : 'Subscribe'}
                </button>


            </div>
        </form>
    );
}


