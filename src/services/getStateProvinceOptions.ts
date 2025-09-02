import { stateProvinceNames } from "../constants/stateProvinceNames";
import type { Region } from "../types/Region";

/**
 * Returns the state/province options for a given region.
 * @param region ISO country code
 */
export function getStateProvinceOptions(region?: Region): string[] {
  if (!region) return [];
  return stateProvinceNames[region] ? stateProvinceNames[region] : [];
}
