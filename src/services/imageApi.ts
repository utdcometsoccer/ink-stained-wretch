import type { ManagedImage } from "../types/ManagedImage";

const BASE_URL = import.meta.env.VITE_IMAGE_API_URL || "/api/images";

export async function uploadImage(file: File, token: string): Promise<ManagedImage> {
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch(`${BASE_URL}/upload`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`
      // 'Content-Type' is not set for FormData; browser sets it automatically
    },
    body: formData
  });
  if (!res.ok) throw new Error("Failed to upload image");
  return await res.json();
}

export async function listUserImages(token: string): Promise<Array<ManagedImage>> {
  const res = await fetch(`${BASE_URL}/user`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });
  if (!res.ok) throw new Error("Failed to fetch user images");
  return await res.json();
}

export async function deleteImage(id: string, token: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });
  if (!res.ok) throw new Error("Failed to delete image");
}
