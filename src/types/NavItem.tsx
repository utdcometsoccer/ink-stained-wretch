import type { UIStates } from './UIStates';
import type { ReactNode } from 'react';

export interface NavItem {
    state: UIStates;
    label: string;
    icon: ReactNode;
    description: string;
}
