export function getImageApiErrorMessage(error: { response?: { status: number; data?: { error?: string } } }): string {
  if (error?.response?.status === 400) {
    return error.response.data?.error || "File too large.";
  }
  if (error?.response?.status === 403) {
    return error.response.data?.error || "Upload limit reached.";
  }
  if (error?.response?.status === 404) {
    return "Image not found.";
  }
  if (error?.response?.status === 401) {
    return "Unauthorized. Please log in.";
  }
  return "An unknown error occurred.";
}
