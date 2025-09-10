import type { FC } from "react";
import { useTrackComponent } from "../../hooks/useTrackComponent";

interface LoginHeaderProps {
  title: string;
  subtitle: string;
}

export const LoginHeader: FC<LoginHeaderProps> = ({ title, subtitle }) => {
  useTrackComponent('LoginHeader', { title, subtitle });
  return (
    <>
      <h1>{title}</h1>
      <p>{subtitle}</p>
    </>
  );
}
