import type { Social } from "../../types/Social";

export interface SocialFormProps {
  social: Social;
  onSave: (social: Social) => void;
  onCancel: () => void;
  culture?: string;
}
