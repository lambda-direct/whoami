/// <reference types="lucia" />
declare namespace Lucia {
	type Auth = import('./src/db/lucia').Auth;
	type DatabaseUserAttributes = Omit<typeof import('./src/db/schema').user['$inferSelect'], 'id'>;
	type DatabaseSessionAttributes = {};
}
