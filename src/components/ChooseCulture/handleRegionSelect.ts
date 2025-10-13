import type { Region } from "../../types/Region";
import type { Dispatch } from "react";
import type { Action } from "../../types/Action";

export function handleRegionSelect(dispatch: Dispatch<Action>) {
  return (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch({ type: 'UPDATE_STATE', payload: { selectedRegion: e.target.value as Region } as any });
  };
}
