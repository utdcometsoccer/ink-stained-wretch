import { useState, useEffect } from "react";
import { fetchAuthorsByDomain } from "../services/fetchAuthorsByDomain";
import { withAuthRetry } from "../services/withAuthRetry";
import { type Author } from "../types/Author";
import type { UseAuthorsByDomainResult } from "../types/UseAuthorsByDomainResult";
import type { Dispatch } from "react";
import type { Action } from "../types/Action";

export function useAuthorsByDomain(
  accessToken: string, 
  secondLevelDomain: string, 
  topLevelDomain: string,
  dispatch?: Dispatch<Action>
): UseAuthorsByDomainResult {
  const [authorInformation, setData] = useState<Author[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      if (!accessToken || !secondLevelDomain || !topLevelDomain) {
        if (!cancelled) {
          setError("Missing required parameters");
          setLoading(false);
        }
        return;
      }

      if (!cancelled) {
        setLoading(true);
        setError(null);
      }
      try {
        const updateToken = (newToken: string | null) => {
          if (dispatch) {
            dispatch({ type: 'UPDATE_STATE', payload: { authToken: newToken } });
          }
        };
        
        const authors = await withAuthRetry(
          (token) => fetchAuthorsByDomain(token, secondLevelDomain, topLevelDomain),
          accessToken,
          updateToken
        );
        if (!cancelled) setData(authors);
      } catch (err) {
        if (!cancelled) {
          if (err instanceof Error) setError(err.message);
          else if (typeof err === "string") setError(err);
          else setError(String(err));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    run();
    return () => { cancelled = true; };
  }, [accessToken, secondLevelDomain, topLevelDomain, dispatch]);

  return { authorInformation, error, loading };
}
