
import { useState, useEffect } from "react";
import { fetchDomainRegistrations } from "../services/fetchDomainRegistrations";
import { withAuthRetry } from "../services/withAuthRetry";
import { type DomainRegistration } from "../types/DomainRegistration";
import type { UseDomainRegistrationsResult } from "../types/UseDomainRegistrationsResult";
import type { Dispatch } from "react";
import type { Action } from "../types/Action";

export function useDomainRegistrations(accessToken: string, dispatch?: Dispatch<Action>): UseDomainRegistrationsResult {
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
        const updateToken = (newToken: string | null) => {
          if (dispatch) {
            dispatch({ type: 'UPDATE_STATE', payload: { authToken: newToken } });
          }
        };
        
        const registrations = await withAuthRetry(
          (token) => fetchDomainRegistrations(token),
          accessToken,
          updateToken
        );
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
  }, [accessToken, dispatch]);

  return { data, error, loading };
}
