import type { PenguinRandomHouseListAuthorTitles } from "../types/PenguinRandomHouse";

export async function fetchPenguinTitlesByAuthorKey(authorKey:string, rows:number, start:number=0): Promise<PenguinRandomHouseListAuthorTitles> {
    const baseUrl = import.meta.env.VITE_PENGUIN_RANDOM_HOUSE_API_URL;
    const apiKey = import.meta.env.VITE_PENGUIN_RANDOM_HOUSE_API_KEY;
    const domain = import.meta.env.VITE_PENGUIN_RANDOM_HOUSE_API_DOMAIN;
    const listTitlesByAuthorAPI = import.meta.env.VITE_PENGUIN_RANDOM_HOUSE_LIST_TITLES_BY_AUTHOR_API;
    if (!baseUrl || !apiKey || !domain || !listTitlesByAuthorAPI) throw new Error("Penguin Random House API configuration is missing in environment variables");
    const url = new URL(baseUrl + listTitlesByAuthorAPI.replace("{domain}", domain).replace("{authorKey}", authorKey).replace("{api_key}", apiKey).replace("{rows}", rows.toString()).replace("{start}", start.toString()));

    const response = await fetch(url);
    if (!response.ok) throw new Error(`Penguin Random House API error: ${response.status}`);
    const result = await response.json() as PenguinRandomHouseListAuthorTitles;    
    return (response.ok && result);
}
