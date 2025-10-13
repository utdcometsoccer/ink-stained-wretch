export interface ChooseCultureState {
  language: string;
  country: string;
  countdown?: number;
  shouldShowCountdown?: boolean;
}

export type ChooseCultureAction =
  | { type: "SET_LANGUAGE"; payload: string }
  | { type: "SET_COUNTRY"; payload: string }
  | { type: "SET_COUNTDOWN"; payload: number | undefined }
  | { type: "RESET_COUNTDOWN" }
  | { type: "SYNC_FROM_PROPS"; payload: { language: string; country: string; countdown?: number; shouldShowCountdown?: boolean } }
  | { type: "SHOW_COUNTDOWN" }
  | { type: "CANCEL_COUNTDOWN" };

export function chooseCultureReducer(
  state: ChooseCultureState,
  action: ChooseCultureAction
): ChooseCultureState {
  switch (action.type) {
    case "SHOW_COUNTDOWN":
      return { ...state, shouldShowCountdown: true };
    case "SET_LANGUAGE":
      return { ...state, language: action.payload };
    case "SET_COUNTRY":
      return { ...state, country: action.payload };
    case "SET_COUNTDOWN":
      return { ...state, countdown: action.payload };
    case "RESET_COUNTDOWN":
      return { ...state, countdown: undefined };
    case "CANCEL_COUNTDOWN":
      return { ...state, countdown: undefined, shouldShowCountdown: false };
    case "SYNC_FROM_PROPS":
      return { ...state, ...action.payload };
    default:
      return state;
  }
}
