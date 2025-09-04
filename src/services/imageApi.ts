import axios from "axios";

const BASE_URL = import.meta.env.VITE_IMAGE_API_URL || "/api/images";

export async function uploadImage(file: File, token: string): Promise<{ id: string; url: string; name: string; size: number }> {
  const formData = new FormData();
  formData.append("file", file);
  const res = await axios.post(`${BASE_URL}/upload`, formData, {
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "multipart/form-data"
    }
  });
  return res.data;
}

export async function listUserImages(token: string): Promise<Array<{ id: string; url: string; name: string; size: number; uploadedAt: string }>> {
  const res = await axios.get(`${BASE_URL}/user`, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });
  return res.data;
}

export async function deleteImage(id: string, token: string): Promise<void> {
  await axios.delete(`${BASE_URL}/${id}`, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });
}
