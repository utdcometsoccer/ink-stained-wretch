interface LogoutButtonProps {
  onSignOut: () => void;
  className?: string;
}

export function LogoutButton({ onSignOut, className }: LogoutButtonProps) {
  return (
    <button onClick={onSignOut} className={className}>Sign out</button>
  );
    useEffect(() => {
      trackComponent('LogoutButton', {});
    }, []);
  }
