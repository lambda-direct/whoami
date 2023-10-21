import 'dotenv/config';

import { serve } from '@hono/node-server';
import { app } from './server';

serve({
	fetch: app.fetch,
	hostname: 'localhost',
	port: 3000,
}, (info) => {
	console.log(`Listening on http://${info.address}:${info.port}`);
});
