import type { AuthorResult, PenguinRandomHouseSearchResult } from "../types/PenguinRandomHouseSearchResult";
import { normalizeArray } from "./normalizeArray";

export async function fetchPenguinRandomHouseAuthors(authorName: string): Promise<AuthorResult[]> {
    const baseUrl = import.meta.env.VITE_PENGUIN_RANDOM_HOUSE_API_URL;
    const apiKey = import.meta.env.VITE_PENGUIN_RANDOM_HOUSE_API_KEY;
    const domain = import.meta.env.VITE_PENGUIN_RANDOM_HOUSE_API_DOMAIN;
    const searchAPI = import.meta.env.VITE_PENGUIN_RANDOM_HOUSE_SEARCH_API;
    if (!baseUrl || !apiKey || !domain || !searchAPI) throw new Error("Penguin Random House API configuration is missing in environment variables");
    const url = `${baseUrl} ${searchAPI.replace("{domain}", domain).replace("{query}", encodeURIComponent(authorName)).replace("{api_key}", apiKey)}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Penguin Random House API error: ${response.status}`);
    const result = await response.json() as PenguinRandomHouseSearchResult;
    const authors = result.data.results.filter(result => result.docType === "author") as AuthorResult[];
    return (response.ok && normalizeArray(authors));
}
