import type { Action } from '../../types/Action';
import type { State } from '../../types/State';

export interface MainContentRendererProps {
  currentUIState: string;
  state: State;
  dispatch: React.Dispatch<Action>;
  isDevelopment: () => boolean;
}