import { type Author } from "../types/Author";

export async function fetchAuthorsByDomain(
  accessToken: string | undefined,
  secondLevelDomain: string,
  topLevelDomain: string
): Promise<Author[]> {
  const apiUrl = import.meta.env.VITE_AUTHOR_API_URL || "";
  if (!apiUrl) throw new Error("API URL is not defined in VITE_AUTHOR_API_URL environment variable");
  const headers: Record<string, string> = { Accept: "application/json" };
  if (accessToken) headers["Authorization"] = `Bearer ${accessToken}`;
  const response = await fetch(`${apiUrl}${secondLevelDomain}/${topLevelDomain}`, {
    headers
  });
  if (!response.ok) throw new Error(`API error: ${response.status}`);
  return await response.json();
}
