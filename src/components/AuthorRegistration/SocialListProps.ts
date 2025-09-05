import type { Social } from "../../types/Social";

export interface SocialListProps {
  socials: Social[];
  onEdit: (id: string) => void;
  onAdd: () => void;
  onDelete: (id: string) => void;
}
