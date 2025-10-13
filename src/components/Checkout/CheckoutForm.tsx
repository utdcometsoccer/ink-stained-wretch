import { CircularProgress } from '@mui/material';
import {
    CardElement,
    useElements,
    useStripe,
} from '@stripe/react-stripe-js';
import type { Dispatch } from 'react';
import { useEffect, useState, type FC } from 'react';
import { useLocalizationContext } from '../../hooks/useLocalizationContext';
import { trackEvent, } from '../../services/applicationInsights';
import { formatError } from '../../services/formatError';
import { submitDomainRegistration } from '../../services/submitDomainRegistration';
import { withAuthRetry } from '../../services/withAuthRetry';
import type { Action } from '../../types/Action';
import type { State } from '../../types/State';
export interface CheckoutFormProps {
    name: string;
    clientSecret: string;
    handleSuccess: () => void;
    state: State;
    dispatch: Dispatch<Action>;
}
export const CheckoutForm: FC<CheckoutFormProps> = ({ name, clientSecret, handleSuccess, state, dispatch }) => {
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
                // Submit domain registration after successful payment
                if (state.domainRegistration) {
                    try {
                        await withAuthRetry(
                            (token) => submitDomainRegistration(state.domainRegistration!, token),
                            state.authToken,
                            (newToken) => dispatch({ type: 'UPDATE_STATE', payload: { authToken: newToken } })
                        );
                        trackEvent('DomainRegistrationSubmitted', { 
                            domain: `${state.domainRegistration.domain?.secondLevelDomain}.${state.domainRegistration.domain?.topLevelDomain}` 
                        });
                    } catch (domainError) {
                        console.error("Domain registration submission error:", domainError);
                        trackEvent('DomainRegistrationError', { error: formatError(domainError) });
                        // Don't block the success flow if domain registration fails
                    }
                }
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


