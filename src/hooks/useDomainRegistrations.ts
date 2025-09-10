import { useState, useEffect } from "react";
import { fetchDomainRegistrations } from "../services/fetchDomainRegistrations";

export function useDomainRegistrations(accessToken: string) {
  const [data, setData] = useState<any[] | null>(null);
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
