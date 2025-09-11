export type DomainRegistrationAction =
  { type: "SET_DOMAIN_INPUT_VALUE"; payload: string } |
  { type: "SET_DOMAIN_ERROR"; payload: string | null } |
  { type: "SET_API_CALL_FAILED"; payload: boolean };
