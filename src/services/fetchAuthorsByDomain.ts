import { type Author } from "../types/Author";

export async function fetchAuthorsByDomain(
  accessToken: string,
  secondLevelDomain: string,
  topLevelDomain: string
): Promise<Author[]> {
  const apiUrl = import.meta.env.VITE_AUTHOR_API_URL || "";
  if (!apiUrl) throw new Error("API URL is not defined in VITE_AUTHOR_API_URL environment variable");
  const response = await fetch(`${apiUrl}${secondLevelDomain}/${topLevelDomain}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json"
    }
  });
  if (!response.ok) throw new Error(`API error: ${response.status}`);
  return await response.json();
}
