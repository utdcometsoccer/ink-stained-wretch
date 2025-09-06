import type { GoogleBooksApiResponse, GoogleBookVolume } from "../types/GoogleBooksApi";

export async function googleBooksvolumesAPI(authorName: string): Promise<GoogleBookVolume[]> {
    const baseUrl = import.meta.env.VITE_GOOGLE_BOOKS_API_URL || "https://www.googleapis.com/books/v1/volumes";
    const response = await fetch(`${baseUrl}?q=inauthor:${encodeURIComponent(authorName)}`);
    const data = await response.json() as GoogleBooksApiResponse;
    return (response.ok && Array.isArray(data.items)) ? data.items : [];
}
