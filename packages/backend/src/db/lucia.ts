import { postgres as postgresAdapter } from '@lucia-auth/adapter-postgresql';
import { lucia } from 'lucia';
import { hono } from 'lucia/middleware';

import 'lucia/polyfill/node';

import { queryClient } from './db';

export const auth = lucia({
	env: 'DEV',
	adapter: postgresAdapter(queryClient, {
		user: 'auth_user',
		session: 'user_session',
		key: 'user_key',
	}),
	middleware: hono(),
	sessionCookie: {
		expires: false,
	},
	getUserAttributes(databaseUser) {
		return {
			username: databaseUser.username,
		};
	},
});

export type Auth = typeof auth;
