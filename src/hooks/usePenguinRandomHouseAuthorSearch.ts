import { useState, useEffect } from "react";
import type { AuthorResult } from "../types/PenguinRandomHouseSearchResult";
import { fetchPenguinRandomHouseAuthors } from "../services/fetchPenguinRandomHouseAuthors";

export interface UsePenguinRandomHouseAuthorSearchResult {
	penguinAuthors: AuthorResult[] | null;
	error: string | null;
	loading: boolean;
}

export function usePenguinRandomHouseAuthorSearch(query: string): UsePenguinRandomHouseAuthorSearchResult {
	const [data, setData] = useState<AuthorResult[] | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState<boolean>(false);

	useEffect(() => {
		if (!query) {
			setData(null);
			setError(null);
			setLoading(false);
			return;
		}
		setLoading(true);
		setError(null);
		fetchPenguinRandomHouseAuthors(query)
			.then((authors) => {
				setData(authors);
			})
			.catch((err) => setError(err.message))
			.finally(() => setLoading(false));
	}, [query]);

	return { penguinAuthors: data, error, loading };
}
