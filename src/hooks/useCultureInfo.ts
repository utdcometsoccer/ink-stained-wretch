import { useContext } from 'react';
import { CultureInfoContext } from '../contexts/CultureInfoContext';
import type { CultureInfoContextType } from '../contexts/CultureInfoContext';

export const useCultureInfo = (): CultureInfoContextType => {
  const context = useContext(CultureInfoContext);
  if (context === undefined) {
    throw new Error('useCultureInfo must be used within a CultureInfoProvider');
  }
  return context;
};