import type { AmazonProductsApiResponse, AmazonProduct } from "../types/AmazonProductsApi";

export async function fetchAmazonBooks(authorName: string, page: number = 1): Promise<AmazonProduct[]> {
  const baseUrl = import.meta.env.VITE_AMAZON_BOOKS_API_URL;
  if (!baseUrl) {
    console.warn("VITE_AMAZON_BOOKS_API_URL is not configured");
    return [];
  }

  const encodedName = encodeURIComponent(authorName);
  const url = `${baseUrl}/api/amazon/books/author/${encodedName}?page=${page}`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Amazon API error: ${response.status}`);
    }
    
    const data = await response.json() as AmazonProductsApiResponse;
    return data.SearchResult?.Items || [];
  } catch (err) {
    console.error("Failed to fetch books from Amazon", err);
    return [];
  }
}
