import { useReducer, useEffect } from "react";
import {
  chooseSubscriptionReducer,
  initialChooseSubscriptionState,
} from "../reducers/chooseSubscriptionReducer";
import type { SubscriptionPlan } from "../types/SubscriptionPlan";
import { fetchSubscriptionPlans } from "../services/subscriptionApi";
import { trackException } from "../services/applicationInsights";
import { fallbackPlans } from "../components/ChooseSubscription/fallbackPlans";
import type { State } from "../types/State";

export function useChooseSubscriptionLogic(state: State, dispatch: React.Dispatch<any>) {
  const { cultureInfo } = state;
  const [subState, subDispatch] = useReducer(
    chooseSubscriptionReducer,
    initialChooseSubscriptionState
  );

  const plans: SubscriptionPlan[] = state.subscriptionPlans || fallbackPlans;

  useEffect(() => {
    let isMounted = true;
    async function getPlans() {
      let tempPlans: SubscriptionPlan[] = fallbackPlans;
      try {
        const apiPlans = await fetchSubscriptionPlans(cultureInfo?.Language, cultureInfo?.Country);
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

  return {
    subState,
    plans,
    handleSelect,
    handleContinue,
  };
}
