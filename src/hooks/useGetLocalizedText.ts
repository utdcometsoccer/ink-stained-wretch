import { useEffect, useState } from "react";
import { getLocalizedText } from "../services/localization";
import type { LocalizedText } from "../types/LocalizedText";
import type { UseGetLocalizedTextResult } from "../types/UseGetLocalizedTextResult";

export function useGetLocalizedText(culture: string): UseGetLocalizedTextResult {
    const [localizedText, setLocalizedText] = useState<LocalizedText | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | string | null>(null);
    useEffect(() => {
        let cancelled = false;
        async function fetchLocalizedText() {
            try {
                const text = await getLocalizedText(culture);
                if (!cancelled) {
                    setLocalizedText(text);
                }
            } catch (err) {
                if (!cancelled) {
                    setError(err instanceof Error ? err : String(err));
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }
        fetchLocalizedText();
        return () => {
            cancelled = true;
        };
    }, [culture]);
    return { localizedText, loading, error };
}