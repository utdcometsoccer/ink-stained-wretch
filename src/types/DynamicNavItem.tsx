import type { ReactNode } from "react";
import type { NavItem } from "./NavItem";

export interface DynamicNavItem extends NavItem {
    label: string;
    icon: ReactNode;
    description: string;
}