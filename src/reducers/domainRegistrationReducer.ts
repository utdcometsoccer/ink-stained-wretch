import type { DomainRegistrationState } from "../types/DomainRegistrationState";
import type { DomainRegistrationAction } from "../types/DomainRegistrationAction";

export function domainRegistrationReducer(
  localState: DomainRegistrationState,
  action: DomainRegistrationAction
): DomainRegistrationState {
  switch (action.type) {
    case "SET_DOMAIN_INPUT_VALUE":
      return { ...localState, domainInputValue: action.payload };
    case "SET_DOMAIN_ERROR":
      return { ...localState, domainError: action.payload };
    case "SET_API_CALL_FAILED":
      return { ...localState, APICallFailed: action.payload };
    default:
      return localState;
  }
}
