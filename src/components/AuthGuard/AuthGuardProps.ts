import type { ReactNode } from 'react';

export interface AuthGuardProps {
  children: ReactNode;
  unauthenticatedContent?: ReactNode;
}