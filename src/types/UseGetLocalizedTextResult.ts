import type { LocalizedText } from "../types/LocalizedText";


export type UseGetLocalizedTextResult = {
    localizedText: LocalizedText | null;
    loading: boolean;
    error: Error | string | null;
};
