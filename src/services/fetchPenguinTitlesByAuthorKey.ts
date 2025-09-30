import type { PenguinRandomHouseListAuthorTitles } from "../types/PenguinRandomHouse";

export async function fetchPenguinTitlesByAuthorKey(authorKey:string, rows:number, start:number=0, accessToken?:string): Promise<PenguinRandomHouseListAuthorTitles> {
    const url = new URL(import.meta.env.VITE_PENGUIN_RANDOM_HOUSE_TITLES_BY_AUTHOR_API_URL.replace("{authorKey}", authorKey));
    if (rows !== undefined) url.searchParams.set('rows', rows.toString());
    if (start !== undefined) url.searchParams.set('start', start.toString());

    const headers: HeadersInit = {};
    if (accessToken) {
        headers.Authorization = `Bearer ${accessToken}`;
    }

    const response = await fetch(url, { headers });
    if (!response.ok) throw new Error(`Penguin Random House API error: ${response.status}`);
    const result = await response.json() as PenguinRandomHouseListAuthorTitles;    
    return (response.ok && result);
}
