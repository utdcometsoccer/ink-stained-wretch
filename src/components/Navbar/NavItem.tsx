import type { UIStates } from '../../types/UIStates';

export interface NavItem {
    state: UIStates;
    label: string;
    icon: string;
    description: string;
}
