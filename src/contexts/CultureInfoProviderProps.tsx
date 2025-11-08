import type { CultureInfo } from '@idahoedokpayi/react-country-state-selector';
import type React from 'react';


export interface CultureInfoProviderProps {
  cultureInfo: CultureInfo | undefined;
  children: React.ReactNode;
}
