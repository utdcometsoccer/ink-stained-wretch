import { createContext } from 'react';
import type { CultureInfo } from '@idahoedokpayi/react-country-state-selector';

export interface CultureInfoContextType {
  cultureInfo: CultureInfo | undefined;
  culture: string;
}

export const CultureInfoContext = createContext<CultureInfoContextType | undefined>(undefined);


