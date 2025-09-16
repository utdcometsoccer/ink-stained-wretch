import type { ManagedImage } from "./ManagedImage";


export interface UseImageManagerProps {
  token: string;
  listUserImages: (token: string) => Promise<ManagedImage[]>;
  deleteImage: (id: string, token: string) => Promise<void>;
}
