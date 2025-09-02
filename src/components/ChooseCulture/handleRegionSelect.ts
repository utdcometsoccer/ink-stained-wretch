import type { Region } from "../../types/Region";
import type { Dispatch } from "react";

export function handleRegionSelect(dispatch: Dispatch<{ type: string; payload?: any }>) {
  return (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch({ type: 'UPDATE_STATE', payload: { selectedRegion: e.target.value as Region } });
  };
}
