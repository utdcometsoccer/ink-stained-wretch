import type { AuthorResult, PenguinRandomHouseSearchResult } from "../types/PenguinRandomHouse";
import { normalizeArray } from "./normalizeArray";

export async function fetchPenguinRandomHouseAuthors(authorName: string): Promise<AuthorResult[]> {
    const url = `${import.meta.env.VITE_PENGUIN_RANDOM_HOUSE_SEARCH_AUTHORS_API_URL}${encodeURIComponent(authorName)}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Penguin Random House API error: ${response.status}`);
    const result = await response.json() as PenguinRandomHouseSearchResult;
    const authors = result.data.results.filter(result => result.docType === "author") as AuthorResult[];
    return (response.ok && normalizeArray(authors));
}
