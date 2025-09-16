import type { FC, ReactNode } from 'react';
import './Container.css';

interface ContainerProps {
  children: ReactNode;
  className?: string;
}

export const Container: FC<ContainerProps> = ({ children, className }) => (
  <div className={`container-shadow${className ? ` ${className}` : ''}`}>
    {children}
  </div>
);

