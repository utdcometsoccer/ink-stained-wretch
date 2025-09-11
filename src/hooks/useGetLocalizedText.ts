import { useEffect, useState } from "react";
import { getLocalizedText } from "../services/localization";
import type { LocalizedText } from "../types/LocalizedText";
import type { UseGetLocalizedTextResult } from "../types/UseGetLocalizedTextResult";

export function useGetLocalizedText(culture: string): LocalizedText|null{
    const [localizedText, setLocalizedText] = useState<LocalizedText|null>(null);
    useEffect(() => {
        async function fetchLocalizedText() {
            try {
                const text = await getLocalizedText(culture);
                setLocalizedText(text);
            } catch (err) {
                console.log(err instanceof Error ? err : String(err));
            }
        }        
        fetchLocalizedText();
    },[culture]);
    return localizedText;
}

export function useGetLocalizedTextV2(culture: string): UseGetLocalizedTextResult {
    const [localizedText, setLocalizedText] = useState<LocalizedText|null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error|string|null>(null);
    useEffect(() => {
        async function fetchLocalizedText() {
            try {
                const text = await getLocalizedText(culture);
                setLocalizedText(text);
            } catch (err) {
                setError(err instanceof Error ? err : String(err));
            } finally {
                setLoading(false);
            }
        }        
        fetchLocalizedText();
    },[culture]);
        return { localizedText, loading, error };
}