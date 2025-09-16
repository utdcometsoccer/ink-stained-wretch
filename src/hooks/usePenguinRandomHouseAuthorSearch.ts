import { useState, useEffect } from "react";
import type { AuthorResult } from "../types/PenguinRandomHouse";

export type FetchPenguinRandomHouseAuthorsFn = (query: string) => Promise<AuthorResult[]>;
import { fetchPenguinRandomHouseAuthors } from "../services/fetchPenguinRandomHouseAuthors";

export interface UsePenguinRandomHouseAuthorSearchResult {
	penguinAuthors: AuthorResult[] | null;
	error: string | null;
	loading: boolean;
}

export function usePenguinRandomHouseAuthorSearch(
	query: string,
	fetchFn: FetchPenguinRandomHouseAuthorsFn = fetchPenguinRandomHouseAuthors
): UsePenguinRandomHouseAuthorSearchResult {
	const [data, setData] = useState<AuthorResult[] | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		let cancelled = false;

		if (!query) {
			setData(null);
			setError(null);
			setLoading(false);
			return;
		}

		setLoading(true);
		setError(null);
		fetchFn(query)
			.then((authors) => {
				if (!cancelled) setData(authors);
			})
			.catch((err) => {
				if (!cancelled) setError(err?.message ?? String(err));
			})
			.finally(() => {
				if (!cancelled) setLoading(false);
			});

		return () => {
			cancelled = true;
		};
	}, [query, fetchFn]);

	return { penguinAuthors: data, error, loading };
}
