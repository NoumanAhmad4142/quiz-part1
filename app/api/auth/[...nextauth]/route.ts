import NextAuth from "next-auth";
import User from "@/models/user";
import connectToDatabase from "@/lib/mongodb";
import bcrypt from "bcryptjs";
import CredentialsProvider from "next-auth/providers/credentials";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
	session: {
		strategy: "jwt",
	},
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_CLIENT_ID as string,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
			profile(profile) {
				return {
					id: profile.sub,
					name: profile.name,
					email: profile.email,
					image: profile.picture, // Google provides the picture field
					role: "user",
				};
			},
		}),

		GithubProvider({
			clientId: process.env.GITHUB_ID as string,
			clientSecret: process.env.GITHUB_SECRET as string,
			authorization: {
				params: { scope: "user:email" },
			},
			profile(profile) {
				return {
					id: profile.id.toString(),
					name: profile.name || profile.login,
					email: profile.email || profile.verified_primary_email,
					image: profile.avatar_url, // GitHub provides the avatar_url field
					role: "user",
				};
			},
		}),

		CredentialsProvider({
			name: "Credentials",
			credentials: {
				email: { label: "Email", type: "email" },
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials) {
				try {
					await connectToDatabase();
					const user = await User.findOne({
						email: credentials?.email ?? "",
					});
					if (!user) {
						throw new Error("No user found");
					}
					const isValidPassword = await bcrypt.compare(
						credentials?.password ?? "",
						user.password as string
					);
					if (!isValidPassword) {
						throw new Error("Invalid password");
					}
					return user;
				} catch (error) {
					if (error instanceof Error) {
						throw new Error(error.message || "Authorization error");
					} else {
						throw new Error("Authorization error");
					}
				}
			},
		}),
	],
	callbacks: {
		async signIn({ account, profile }) {
			try {
				await connectToDatabase();
				let existingUser;

				if (
					account?.provider === "github" ||
					account?.provider === "google"
				) {
					const email =
						profile?.email ||
						(account.provider === "github" && profile?.email);
					if (!email) throw new Error("Email is required");

					existingUser = await User.findOne({ email });

					if (!existingUser) {
						existingUser = await User.create({
							name: profile?.name || `${account.provider} User`,
							email: email,
							password: await bcrypt.hash(
								Math.random().toString(36).slice(-8),
								10
							),
							role: "user",
							age: 0,
							image: profile?.image, // Assuming profile has image
						});
					}
				}
				return true;
			} catch (error) {
				console.error("Error in signIn callback:", error);
				return false;
			}
		},
		async jwt({ token, user, account, profile }) {
			if (user) {
				token.id = user.id;
				token.email = user.email;
				token.name = user.name;
				token.role = user.role;
				token.image = user.image; // Add image to token
			} else if (
				account?.provider === "github" ||
				account?.provider === "google"
			) {
				await connectToDatabase();
				const existingUser = await User.findOne({ email: token.email });
				if (existingUser) {
					token.id = existingUser.id;
					token.role = existingUser.role;
					token.image = existingUser.image;
				}
			}
			return token;
		},
		async session({ session, token }) {
			if (token) {
				session.user = {
					id: token.id as string,
					email: token.email,
					name: token.name,
					role: token.role as string,
					image: token.image as string | null | undefined, // Add image to session
				};
			}
			return session;
		},
	},
	secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
