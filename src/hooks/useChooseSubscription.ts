import { useReducer } from "react";
import {
  chooseSubscriptionReducer,
  initialChooseSubscriptionState,
} from "../reducers/chooseSubscriptionReducer";
import type { SubscriptionPlan } from "../types/SubscriptionPlan";
import { fetchSubscriptionPlans } from "../services/subscriptionApi";
import { withAuthRetry } from "../services/withAuthRetry";
import { trackException } from "../services/applicationInsights";
import { fallbackPlans } from "../components/ChooseSubscription/fallbackPlans";
import type { State } from "../types/State";
import type { AppAction } from "../types/actions";
import { useRunOnce } from "./useRunOnce";

export function useChooseSubscriptionLogic(state: State, dispatch: React.Dispatch<AppAction>) {  
  const [subState, subDispatch] = useReducer(
    chooseSubscriptionReducer,
    initialChooseSubscriptionState
  );

  useRunOnce(() => {
    async function getPlans() {
      let tempPlans: SubscriptionPlan[] = fallbackPlans;
      try {
        const apiPlans: SubscriptionPlan[] = [];
        let hasMore = true;
        let lastId: string | undefined = undefined;
  let page = 0;
  const MAX_PAGES = Number.parseInt(import.meta.env.VITE_SUBSCRIPTION_PLANS_MAX_PAGES || '20', 10) || 20; // safety guard from env

        while (hasMore && page < MAX_PAGES) {
          const updateToken = (newToken: string | null) => {
            dispatch({ type: 'UPDATE_STATE', payload: { authToken: newToken } });
          };
          
          const resp = await withAuthRetry(
            (token) => fetchSubscriptionPlans({
              active: true,
              limit: 25,
              includeProductDetails: true,
              culture: state.cultureInfo?.Culture,
              // NOTE: If the API supports cursoring, add it to the request type and pass it here.
            }, token),
            state.authToken ?? undefined,
            updateToken
          );

          apiPlans.push(...resp.plans);
          hasMore = resp.hasMore;

          // Track lastId to avoid accidental infinite loops if hasMore stays true without progression
          if (resp.lastId && resp.lastId !== lastId) {
            lastId = resp.lastId;
          } else if (hasMore) {
            // No progress in cursor but API claims more pages; break to avoid tight loop
            break;
          }
          page++;
        }

        if (apiPlans.length > 0) {
          tempPlans = apiPlans;
        }
      } catch (error) {
        tempPlans = fallbackPlans;
        if (trackException) {
          trackException(error instanceof Error ? error : new Error(String(error)), 3);
        }
      } finally {        
          dispatch({ type: "UPDATE_STATE", payload: { subscriptionPlans: tempPlans } });
      }
    }
    void getPlans();
  });

  const handleSelect = (idx: number) => {
    const plans = state.subscriptionPlans || fallbackPlans;
    subDispatch({ type: "SELECT_PLAN", payload: idx });
    dispatch({ type: "UPDATE_STATE", payload: { selectedSubscriptionPlan: plans[idx] } });
  };


  return {
    subState,
    handleSelect
  };
}
