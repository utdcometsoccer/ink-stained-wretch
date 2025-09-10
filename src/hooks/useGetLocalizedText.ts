import { useEffect, useState } from "react";
import { getLocalizedText } from "../services/localization";
import type { LocalizedText } from "../types/LocalizedText";

export function useGetLocalizedText(culture: string): LocalizedText|null{
    const [localizedText, setLocalizedText] = useState<LocalizedText|null>(null);
    useEffect(() => {
        async function fetchLocalizedText() {
            setLocalizedText(await getLocalizedText(culture));
        }
        fetchLocalizedText();
    },[culture]);
    return localizedText;
}