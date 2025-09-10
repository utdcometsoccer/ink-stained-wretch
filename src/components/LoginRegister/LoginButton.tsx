import type { FC } from "react";
import { useTrackComponent } from "../../hooks/useTrackComponent";

export interface LoginButtonProps {
  onSignIn: () => void;
  className?: string;
  label: string;
}

export const LoginButton: FC<LoginButtonProps> = ({ onSignIn, className, label }) => {
  useTrackComponent('LoginButton', { onSignIn, className, label });
  return (
    <button onClick={onSignIn} className={className}>{label}</button>
  );
}
