export function normalizeArray<T>(data?: T[]): T[] {
    return Array.isArray(data) ? data : [];
}
