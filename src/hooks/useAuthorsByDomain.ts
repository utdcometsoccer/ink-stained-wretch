import { useState, useEffect } from "react";
import { fetchAuthorsByDomain } from "../services/fetchAuthorsByDomain";
import { type Author } from "../types/Author";
import type { UseAuthorsByDomainResult } from "../types/UseAuthorsByDomainResult";

export function useAuthorsByDomain(accessToken: string, secondLevelDomain: string, topLevelDomain: string): UseAuthorsByDomainResult {
  const [authorInformation, setData] = useState<Author[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!accessToken || !secondLevelDomain || !topLevelDomain) {
      setError("Missing required parameters");
      setLoading(false);
      return;
    }
    setLoading(true);
    fetchAuthorsByDomain(accessToken, secondLevelDomain, topLevelDomain)
      .then(setData)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [accessToken, secondLevelDomain, topLevelDomain]);

  return { authorInformation, error, loading };
}
