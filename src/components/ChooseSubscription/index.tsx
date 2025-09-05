import { useReducer, useEffect } from "react";
import type { FC } from "react";
import type { State } from "../../types/State";
import type { Dispatch } from "react";
import type { Action } from "../../reducers/appReducer";
import "./ChooseSubscription.css";
import {
  chooseSubscriptionReducer,
  initialChooseSubscriptionState,
} from "../../reducers/chooseSubscriptionReducer";
import type { SubscriptionPlan } from "../../types/SubscriptionPlan";
import { fetchSubscriptionPlans } from "../../services/subscriptionApi";
import { trackException } from "../../services/applicationInsights";

interface ChooseSubscriptionProps {
  state: State;
  dispatch: Dispatch<Action>;
}

const fallbackPlans: SubscriptionPlan[] = [
  {
    label: "1 Year Subscription",
    price: 59,
    duration: 1,
    features: ["Image hosting for up to 20 images", "Full access to all features", "Priority support"],
  },
  {
    label: "2 Year Subscription",
    price: 99,
    duration: 2,
    features: ["Image hosting for up to 20 images", "Full access to all features", "Priority support"],
  },
  {
    label: "3 Year Subscription",
    price: 149,
    duration: 3,
    features: ["Image hosting for up to 20 images", "Full access to all features", "Priority support"],
  },
];

export const ChooseSubscription: FC<ChooseSubscriptionProps> = ({ state, dispatch }) => {
  const [subState, subDispatch] = useReducer(
    chooseSubscriptionReducer,
    initialChooseSubscriptionState
  );

  // Plans are stored in app state
  const plans: SubscriptionPlan[] = state.subscriptionPlans || fallbackPlans;

  useEffect(() => {
    let isMounted = true;
    async function getPlans() {
      let tempPlans: SubscriptionPlan[] = fallbackPlans;
      try {
        const apiPlans = await fetchSubscriptionPlans();
        if (isMounted && apiPlans.length > 0) {
          tempPlans = apiPlans;
        }
      } catch (error) {
        tempPlans = fallbackPlans;
        if (trackException) {
          trackException(error instanceof Error ? error : new Error(String(error)), 3);
        }
        isMounted = true;
      } finally {
        if (isMounted) {
          dispatch({ type: "UPDATE_STATE", payload: { subscriptionPlans: tempPlans } });
        }
      }
    }
    getPlans();
    return () => { isMounted = false; };
  }, [dispatch, state.subscriptionPlans]);

  const handleSelect = (idx: number) => {
    subDispatch({ type: "SELECT_PLAN", payload: idx });
    dispatch({ type: "UPDATE_STATE", payload: { selectedSubscriptionPlan: plans[idx] } });
  };

  const handleContinue = () => {
    if (subState.selected !== null) {
      dispatch({ type: "SET_UI_STATE", payload: "checkout" });
    }
  };

  return (
    <div className="choose-subscription-page">
      <h1 className="choose-subscription-title">Choose Your Subscription</h1>
      <div className="choose-subscription-options">
        {plans.map((plan, idx) => (
          <div
            key={plan.label}
            className={`choose-subscription-card${subState.selected === idx ? " selected" : ""}`}
            onClick={() => handleSelect(idx)}
          >
            <h2>{plan.label}</h2>
            <div className="choose-subscription-price">${plan.price}</div>
            <ul className="choose-subscription-features">
              {plan.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
            {subState.selected === idx && <div className="choose-subscription-selected">Selected</div>}
          </div>
        ))}
      </div>
      <button
        className="app-btn"
        disabled={subState.selected === null}
        onClick={handleContinue}
      >
        Continue to Checkout
      </button>
      <div className="choose-subscription-note">
        <strong>All plans include image hosting for up to 20 images.</strong>
      </div>
    </div>
  );
};

export default ChooseSubscription;
