import type { FC } from "react";
import type { LoginButtonProps } from "./LoginButtonProps";

export const LoginButton: FC<LoginButtonProps> = ({ onSignIn }) => (
  <button onClick={onSignIn}>Sign in with Microsoft</button>
);
