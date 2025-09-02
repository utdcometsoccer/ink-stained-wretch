interface LogoutButtonProps {
  onSignOut: () => void;
}

export function LogoutButton({ onSignOut }: LogoutButtonProps) {
  return (
    <button onClick={onSignOut}>Sign out</button>
  );
}
