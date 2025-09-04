export interface ChooseSubscriptionState {
  selected: number | null;
}

export type ChooseSubscriptionAction =
  | { type: "SELECT_PLAN"; payload: number }
  | { type: "RESET_SELECTION" };

export const initialChooseSubscriptionState: ChooseSubscriptionState = {
  selected: null,
};

export function chooseSubscriptionReducer(
  state: ChooseSubscriptionState,
  action: ChooseSubscriptionAction
): ChooseSubscriptionState {
  switch (action.type) {
    case "SELECT_PLAN":
      return { ...state, selected: action.payload };
    case "RESET_SELECTION":
      return { ...state, selected: null };
    default:
      return state;
  }
}
