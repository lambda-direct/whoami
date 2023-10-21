import { parseEnv, z } from 'znv';

export const env = parseEnv(process.env, {
	DATABASE_URL: z.string(),
});
