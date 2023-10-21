import 'dotenv/config';

import { auth } from '../src/db/lucia';

await auth.createUser({
	key: {
		providerId: 'username',
		providerUserId: 'admin',
		password: 'admin',
	},
	attributes: {
		username: 'admin',
	},
});

console.log('Created user: admin');

process.exit(0);
