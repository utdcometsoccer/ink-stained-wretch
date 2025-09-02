
import type { Culture } from "../types/Culture";
import type { Region } from "../types/Region";
import { getRegionFromCulture } from "./getRegionFromCulture";

/**
 * Extracts the region from domainContactInfo or culture.
 * @param domainContactInfo The contact info object, may contain country.
 * @param culture The culture string or object.
 * @returns Region or undefined
 */
export function extractSelectedRegion(
    domainContactInfo: { country?: string } | undefined,
    culture: Culture | undefined
): Region | undefined {
    if (domainContactInfo?.country) {
        return domainContactInfo.country as Region;
    } else if (culture) {
        return getRegionFromCulture(culture);
    } else {
        return undefined;
    }
}
