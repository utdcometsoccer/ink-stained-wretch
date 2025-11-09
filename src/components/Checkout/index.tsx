import { CircularProgress } from '@mui/material';
import { useEffect, useState, type FC } from 'react';
import { useLocalizationContext } from '../../hooks/useLocalizationContext';
import { useRunOnce } from '../../hooks/useRunOnce';
import { useTrackComponent } from '../../hooks/useTrackComponent';
import { createSubscription } from '../../services/createSubscription';
import { formatError } from '../../services/formatError';
import type { SubscriptionCreateResponse } from '../../types/Stripe';
import "./Checkout.css";
import { CheckoutForm } from './CheckoutForm';
import type { CheckoutProps } from './CheckoutProps';



export const Checkout: FC<CheckoutProps> = ({ state, dispatch }) => {

  const { selectedSubscriptionPlan, customer, userProfile } = state;
  const { id } = customer || { id: null };
  const { displayName } = userProfile || { displayName: '' };
  const [loading, setLoading] = useState<boolean>(true);
  const [subscription, setSubscription] = useState<SubscriptionCreateResponse | null>(null);
  const { stripePriceId } = selectedSubscriptionPlan || { stripePriceId: null };
  
  useTrackComponent('Checkout', { state });
  
  useEffect(() => {
    if (!id) {
      dispatch({ type: 'SET_ERROR', payload: 'No Stripe customer ID found' });
    } else {
      dispatch({ type: 'CLEAR_ERROR' });
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (!stripePriceId) {
      dispatch({ type: 'SET_ERROR', payload: 'No Stripe price ID found' });
    } else {
      dispatch({ type: 'CLEAR_ERROR' });
    }
  }, [dispatch, stripePriceId]);

  const localized = useLocalizationContext();
  const localizedCheckout = localized.Checkout;

  useRunOnce(() => {
    const run = async () => {
      try {
        // Validate required parameters before calling createSubscription
        if (!stripePriceId) {
          throw new Error('Stripe Price ID is required but not provided');
        }
        if (!id) {
          throw new Error('Stripe Customer ID is required but not provided');
        }
        if (!state.authToken) {
          throw new Error('Authentication token is required but not provided');
        }
        
        const response = await createSubscription({ PriceId: stripePriceId, CustomerId: id }, state.authToken);
        // handle success
        setSubscription(response);
      } catch (error) {
        // handle error
        dispatch({ type: 'SET_ERROR', payload: formatError(error) });
      } finally {
        // finalize
        setLoading(false);
      }
    };
    void run();
  });

  const { subscriptionId, clientSecret } = subscription || {};
  
  useEffect(() => {
    if (!loading) {
      if (!clientSecret) {
        dispatch({ type: 'SET_ERROR', payload: 'No Stripe client secret found' });
      } else {
        dispatch({ type: 'CLEAR_ERROR' });
      }
      dispatch({ type: 'UPDATE_STATE', payload: { SubscriptionId: subscriptionId } });
    }
  }, [dispatch, clientSecret, loading, subscriptionId]);

  if (loading && !clientSecret) {
    return <CircularProgress />;
  }

  return selectedSubscriptionPlan ? (

    <div className="checkout-page">
      <CheckoutForm 
        name={displayName || ''} 
        clientSecret={clientSecret || ''} 
        handleSuccess={() => dispatch({ type: 'SET_UI_STATE', payload: 'thankYou' })} 
        state={state}
        dispatch={dispatch}
      />
    </div>
  ) : <div>{localizedCheckout.selectPlan}</div>;
};




