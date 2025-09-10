import { useTrackComponent } from "../../hooks/useTrackComponent";

interface LogoutHeaderProps {
  label: string;
}

export function LogoutHeader({ label }: LogoutHeaderProps) {
  useTrackComponent('LogoutHeader', { label });
  return (
    <h1>{label}</h1>
  );
}
