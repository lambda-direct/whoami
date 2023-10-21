import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type {} from '@redux-devtools/extension';
import { client } from '@/api/api';
import type { InferResponseType } from 'hono/client';
import { immer } from 'zustand/middleware/immer';

interface User {
	username: string;
}

export interface UserState {
	user?: User | undefined;
	login(username: string, password: string): Promise<InferResponseType<typeof client.login.$post>>;
	getMe(): Promise<InferResponseType<typeof client.me.$get>>;
	logout(): Promise<void>;
}

export const useUserStore = create<UserState>()(
	devtools(
		immer(
			persist((set) => ({
				async login(username, password) {
					const response = await client.login.$post({
						json: {
							username,
							password,
						},
					});
					const json = await response.json();
					if ('error' in json) {
						throw new Error(json.error);
					}
					set({ user: json.user });
					return json.user;
				},

				async getMe() {
					const response = await client.me.$get();
					const json = await response.json();
					if ('error' in json) {
						throw new Error(json.error);
					}
					set({ user: json.user });
					return json.user;
				},

				async logout() {
					const response = await client.logout.$get();
					const json = await response.json();
					if ('error' in json) {
						throw new Error(json.error);
					}
					set({ user: undefined });
				},
			}), { name: 'user' }),
		),
	),
);
