import { useTrackComponent } from "../../hooks/useTrackComponent";

export interface LogoutButtonProps {
  onSignOut: () => void;
  className?: string;
  label: string;
}

export function LogoutButton({ onSignOut, className, label }: LogoutButtonProps) {
  useTrackComponent('LogoutButton', { onSignOut, className, label });
  return (
    <button onClick={onSignOut} className={className}>{label}</button>
  );
}
