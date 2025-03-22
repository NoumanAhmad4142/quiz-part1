import NextAuth from "next-auth";

declare module "next-auth" {
	interface Session {
		user: {
			id: string;
			name?: string | null;
			email?: string | null;
			image?: string | null;
			role?: string | null; // Add role to the Session type
		};
	}

	interface User {
		id: string;
		name: string;
		email: string;
		role: string;
	}

	interface JWT {
		id: string;
		name: string;
		email: string;
		role: string;
	}
}
