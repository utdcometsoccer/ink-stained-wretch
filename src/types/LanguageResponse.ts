import type { Language } from "@idahoedokpayi/react-country-state-selector";

export interface LanguageDetail {
    code: Language;
    name: string;
    culture: string;
}

export interface LanguageResponse {
    data: LanguageDetail[];
}
