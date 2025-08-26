import type { Culture } from "../types/Culture";
import type { Region } from "../types/Region";
import { isValidCulture } from "./isValidCulture";
import { isValidRegion } from "./isValidRegion";

/**
 * Extracts the region code from a Culture object or string.
 * Supports both objects with a region property and culture strings like "en-US".
 */
export function getRegionFromCulture(culture: Culture): Region | undefined {

    if (isValidCulture(culture)) {
        // Expecting format like "en-US" or "fr-FR"
        const parts = culture.split("-");
        if (parts.length === 2) {
            const region = parts[1] as Region;
            return isValidRegion(region) ? region : undefined;
        }
    }
    return undefined;
}
