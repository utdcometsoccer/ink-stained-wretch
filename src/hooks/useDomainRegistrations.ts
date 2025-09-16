
import { useState, useEffect } from "react";
import { fetchDomainRegistrations } from "../services/fetchDomainRegistrations";
import { type DomainRegistration } from "../types/DomainRegistration";
import type { UseDomainRegistrationsResult } from "../types/UseDomainRegistrationsResult";

export function useDomainRegistrations(accessToken: string): UseDomainRegistrationsResult {
  const [data, setData] = useState<DomainRegistration[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      if (!accessToken) {
        if (!cancelled) {
          setError("No access token provided");
          setLoading(false);
        }
        return;
      }
      try {
        setLoading(true);
        const registrations = await fetchDomainRegistrations(accessToken);
        if (!cancelled) {
          setData(registrations);
        }
      } catch (err) {
        if (!cancelled) {
          if (err instanceof Error) {
            setError(err.message);
          } else if (typeof err === "string") {
            setError(err);
          } else {
            setError(String(err));
          }
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [accessToken]);

  return { data, error, loading };
}
