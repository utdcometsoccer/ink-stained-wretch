import React, { createContext, useContext } from 'react';
import type { CultureInfo } from '@idahoedokpayi/react-country-state-selector';
import { getBrowserCultureWithFallback } from '../services/getBrowserCultureWithFallback';

export interface CultureInfoContextType {
  cultureInfo: CultureInfo | undefined;
  culture: string;
}

const CultureInfoContext = createContext<CultureInfoContextType | undefined>(undefined);

interface CultureInfoProviderProps {
  cultureInfo: CultureInfo | undefined;
  children: React.ReactNode;
}

export const CultureInfoProvider: React.FC<CultureInfoProviderProps> = ({ 
  cultureInfo, 
  children 
}) => {
  const culture = cultureInfo?.Culture || getBrowserCultureWithFallback().Culture;
  
  const value: CultureInfoContextType = {
    cultureInfo,
    culture
  };

  return (
    <CultureInfoContext.Provider value={value}>
      {children}
    </CultureInfoContext.Provider>
  );
};

export const useCultureInfo = (): CultureInfoContextType => {
  const context = useContext(CultureInfoContext);
  if (context === undefined) {
    throw new Error('useCultureInfo must be used within a CultureInfoProvider');
  }
  return context;
};