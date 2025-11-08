import type React from 'react';
import { getBrowserCultureWithFallback } from '../services/getBrowserCultureWithFallback';
import { type CultureInfoContextType, CultureInfoContext } from './CultureInfoContext';
import type { CultureInfoProviderProps } from './CultureInfoProviderProps';


export const CultureInfoProvider: React.FC<CultureInfoProviderProps> = ({
  cultureInfo, children
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
