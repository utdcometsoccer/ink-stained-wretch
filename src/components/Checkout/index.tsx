import { CircularProgress } from '@mui/material';
import { useEffect, useRef, useState, type FC } from 'react';
import { useLocalizationContext } from '../../hooks/useLocalizationContext';
import { useTrackComponent } from '../../hooks/useTrackComponent';
import "./Checkout.css";
import { CheckoutForm } from './CheckoutForm';
import type { CheckoutProps } from './CheckoutProps';
import { createSubscription } from '../../services/createSubscription';
import type { SubscriptionCreateResponse } from '../../types/Stripe';
import { formatError } from '../../services/formatError';



export const Checkout: FC<CheckoutProps> = ({ state, dispatch }) => {

  const { selectedSubscriptionPlan, customer, userProfile } = state;
  const { id, email } = customer || { id: null, email: null };
  const { displayName } = userProfile || { displayName: '' };
  const [loading, setLoading] = useState<boolean>(true);
  const [subscription, setSubscription] = useState<SubscriptionCreateResponse | null>(null);
  useEffect(() => {
    !id ? dispatch({ type: 'SET_ERROR', payload: 'No Stripe customer ID found' }) : dispatch({ type: 'CLEAR_ERROR' });
    !email ? dispatch({ type: 'SET_ERROR', payload: 'No email found' }) : dispatch({ type: 'CLEAR_ERROR' });
  }, [dispatch, id, email]);
  useTrackComponent('Checkout', { state });
  const { stripePriceId } = selectedSubscriptionPlan || { stripePriceId: null };
  useEffect(() => {
    !stripePriceId ? dispatch({ type: 'SET_ERROR', payload: 'No Stripe price ID found' }) : dispatch({ type: 'CLEAR_ERROR' });
  }, [dispatch, stripePriceId]);
  const localized = useLocalizationContext();
  const localizedCheckout = localized.Checkout;
  const didRunRef = useRef(false);
  useEffect(() => {
    if (didRunRef.current) return; // guard against Strict Mode double-invoke
    didRunRef.current = true;
    let canceled = false;
    const run = async () => {
      try {
        const response = await createSubscription({ PriceId: stripePriceId || '', CustomerId: id || '' });
        if (canceled) return;
        // handle success
        setSubscription(response);
        
      } catch (error) {
        if (canceled) return;
        // handle error
        dispatch({ type: 'SET_ERROR', payload: formatError(error) });
      } finally {
        if (canceled) return;
        // finalize
        setLoading(false);
      }
    }
    run();
    return () => {
      canceled = true;
    };
  }, []);
  
  const { subscriptionId, clientSecret } = subscription || {};
  useEffect(() => {    
    if (!loading) {
      !clientSecret ? dispatch({ type: 'SET_ERROR', payload: 'No Stripe client secret found' }) : dispatch({ type: 'CLEAR_ERROR' });
      dispatch({ type: 'UPDATE_STATE', payload: { subscriptionId } });
    }
  }, [dispatch, clientSecret, loading]);

  if (loading && !clientSecret) {
    return <CircularProgress />;
  }

  return selectedSubscriptionPlan ? (

    <div className="checkout-page">
      <CheckoutForm name={displayName || ''} clientSecret={clientSecret || ''} />
    </div>
  ) : <div>{localizedCheckout.selectPlan}</div>;
};




