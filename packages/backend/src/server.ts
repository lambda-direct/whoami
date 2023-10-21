import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { z } from 'zod';

import { LuciaError } from 'lucia';
import { auth } from './db/lucia';

export const app = new Hono();

app.use(
	'*',
	cors({
		origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
		credentials: true,
	}),
);

const route = app
	.post(
		'/login',
		zValidator(
			'json',
			z.object({
				username: z.string(),
				password: z.string(),
			}),
		),
		async (ctx) => {
			const { username, password } = ctx.req.valid('json');
			try {
				const key = await auth.useKey('username', username.toLowerCase(), password);
				const session = await auth.createSession({
					userId: key.userId,
					attributes: {},
				});
				const sessionCookie = auth.createSessionCookie(session);

				ctx.header('Set-Cookie', sessionCookie.serialize().replace('Lax', 'None; Secure'));
				return ctx.jsonT({ user: session.user });
			} catch (err) {
				if (
					err instanceof LuciaError && (err.message === 'AUTH_INVALID_KEY_ID'
						|| err.message === 'AUTH_INVALID_PASSWORD')
				) {
					ctx.status(401);
					return ctx.jsonT({ error: err.message });
				}
				throw err;
			}
		},
	)
	.get(
		'/me',
		async (ctx) => {
			const authRequest = auth.handleRequest(ctx);
			const session = await authRequest.validate();
			if (!session) {
				ctx.status(401);
				return ctx.jsonT({ error: 'Unauthorized' });
			}
			return ctx.jsonT({ user: session.user });
		},
	)
	.get('/logout', async (ctx) => {
		const authRequest = auth.handleRequest(ctx);
		const session = await authRequest.validate();
		if (!session) {
			ctx.status(401);
			return ctx.jsonT({ error: 'Unauthorized' });
		}
		await auth.invalidateSession(session.sessionId);
		ctx.header('Set-Cookie', auth.createSessionCookie(null).serialize().replace('Lax', 'None; Secure'));
		return ctx.jsonT({ success: true });
	});

export type AppRoute = typeof route;
