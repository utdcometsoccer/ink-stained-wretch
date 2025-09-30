import type { ManagedImage } from "../../types/ManagedImage";
export interface ImageManagerProps {
  token: string;
  onSelect: (image: ManagedImage) => void;
  listUserImages: (token: string) => Promise<Array<ManagedImage>>;
  deleteImage: (id: string, token: string) => Promise<void>;
  uploadImage: (file: File, token: string) => Promise<ManagedImage>;
  culture?: string;
}
