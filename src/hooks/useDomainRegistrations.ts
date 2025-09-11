
import { useState, useEffect } from "react";
import { fetchDomainRegistrations } from "../services/fetchDomainRegistrations";
import { type DomainRegistration } from "../types/DomainRegistration";
import type { UseDomainRegistrationsResult } from "../types/UseDomainRegistrationsResult";

export function useDomainRegistrations(accessToken: string): UseDomainRegistrationsResult {
  const [data, setData] = useState<DomainRegistration[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!accessToken) {
      setError("No access token provided");
      setLoading(false);
      return;
    }
    setLoading(true);
    fetchDomainRegistrations(accessToken)
      .then(setData)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [accessToken]);

  return { data, error, loading };
}
