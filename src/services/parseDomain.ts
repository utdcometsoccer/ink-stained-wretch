export function parseDomain(domain: string): { secondLevelDomain: string; topLevelDomain: string } {
    const parts = domain.trim().split('.');
    if (parts.length < 2) {
        return { secondLevelDomain: '', topLevelDomain: '' };
    }
    const [secondLevelDomain, topLevelDomain] = parts.slice(-2);
    return { secondLevelDomain, topLevelDomain };
}