import type { AppRoute } from 'backend/server';
import { hc } from 'hono/client';

export const client = hc<AppRoute>('http://localhost:3000', {
	fetch: (input: RequestInfo | URL, init?: RequestInit) => {
		return fetch(input, {
			...init,
			credentials: 'include',
		});
	},
});
