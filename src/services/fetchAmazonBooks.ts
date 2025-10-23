import type { AmazonProductsApiResponse, AmazonProduct } from "../types/AmazonProductsApi";
import { UnauthorizedError } from "../types/UnauthorizedError";

export async function fetchAmazonBooks(
  authorName: string, 
  accessToken: string | undefined,
  page: number = 1
): Promise<AmazonProduct[]> {
  const apiUrl = import.meta.env.VITE_AMAZON_BOOKS_API_URL || "";
  if (!apiUrl) throw new Error("API URL is not defined in VITE_AMAZON_BOOKS_API_URL environment variable");
  
  const headers: Record<string, string> = { Accept: "application/json" };
  if (accessToken) headers["Authorization"] = `Bearer ${accessToken}`;
  
  const encodedName = encodeURIComponent(authorName);
  const url = `${apiUrl}/${encodedName}?page=${page}`;
  
  const response = await fetch(url, { headers });
  if (response.status === 401) throw new UnauthorizedError();
  if (!response.ok) throw new Error(`Amazon API error: ${response.status}`);
  
  const data = await response.json() as AmazonProductsApiResponse;
  return data.SearchResult?.Items || [];
}
