import type { ManagedImage } from "../types/ManagedImage";

const UPLOAD_URL = import.meta.env.VITE_IMAGE_UPLOAD_API_URL || "/api/images/upload";
const USER_URL = import.meta.env.VITE_IMAGE_USER_API_URL || "/api/images/user";
const DELETE_URL = import.meta.env.VITE_IMAGE_DELETE_API_URL || "/api/images/delete";

export async function uploadImage(file: File, token?: string): Promise<ManagedImage> {
  const formData = new FormData();
  formData.append("file", file);
  const headers: Record<string, string> = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(UPLOAD_URL, {
    method: "POST",
    headers,
    body: formData
  });
  if (!res.ok) throw new Error("Failed to upload image");
  return await res.json();
}

export async function listUserImages(token?: string): Promise<Array<ManagedImage>> {
  const headers: Record<string, string> = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(USER_URL, {
    method: "GET",
    headers
  });
  if (!res.ok) throw new Error("Failed to fetch user images");
  return await res.json();
}

export async function deleteImage(id: string, token?: string): Promise<void> {
  const headers: Record<string, string> = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`${DELETE_URL}/${id}`, {
    method: "DELETE",
    headers
  });
  if (!res.ok) throw new Error("Failed to delete image");
}
