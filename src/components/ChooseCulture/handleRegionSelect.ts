import type { Region } from "../../types/Region";
import type { Dispatch } from "react";
import type { LoginAction } from "../../types/LoginAction";

export function handleRegionSelect(dispatch: Dispatch<LoginAction>) {
  return (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch({ type: 'UPDATE_STATE', payload: { selectedRegion: e.target.value as Region } });
  };
}
