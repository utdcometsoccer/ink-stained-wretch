export type LoginAction = 
  | { type: "START_REDIRECT"; countdown: number }
  | { type: "STOP_REDIRECT" }
  | { type: "TICK" };
