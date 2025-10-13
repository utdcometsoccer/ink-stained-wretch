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
  useEffect(() => {
    !id ? dispatch({ type: 'SET_ERROR', payload: 'No Stripe customer ID found' }) : dispatch({ type: 'CLEAR_ERROR' });    
  }, [dispatch, id]);
  useTrackComponent('Checkout', { state });
  const { stripePriceId } = selectedSubscriptionPlan || { stripePriceId: null };
  useEffect(() => {
    !stripePriceId ? dispatch({ type: 'SET_ERROR', payload: 'No Stripe price ID found' }) : dispatch({ type: 'CLEAR_ERROR' });
  }, [dispatch, stripePriceId]);
  const localized = useLocalizationContext();
  const localizedCheckout = localized.Checkout;
  useRunOnce(() => {
    const run = async () => {
      try {
        const response = await createSubscription({ PriceId: stripePriceId || '', CustomerId: id || '' }, state.authToken ?? undefined);
        // handle success
        setSubscription(response);
      } catch (error) {
        // handle error
        dispatch({ type: 'SET_ERROR', payload: formatError(error) });
      } finally {
        // finalize
        setLoading(false);
      }
    }
    run();
  });

  const { subscriptionId, clientSecret } = subscription || {};
  useEffect(() => {
    if (!loading) {
      !clientSecret ? dispatch({ type: 'SET_ERROR', payload: 'No Stripe client secret found' }) : dispatch({ type: 'CLEAR_ERROR' });
      dispatch({ type: 'UPDATE_STATE', payload: { SubscriptionId: subscriptionId } });
    }
  }, [dispatch, clientSecret, loading]);

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




