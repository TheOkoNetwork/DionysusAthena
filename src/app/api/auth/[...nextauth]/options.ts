import { NextAuthOptions, Session } from "next-auth";
import { JWT } from "next-auth/jwt";
// You might need to import specific types for JWT callback parameters if not
// implicitly handled by NextAuthOptions typing.
// import { JWTCallbackParameters } from "next-auth/core/types";

// Augment the NextAuth types to include accessToken in Session and access_token in JWT
declare module "next-auth" {
    interface Session {
        accessToken?: string;
        user: { // Ensure user is defined
            id?: string | null; // Add id to user
            username?: string | null; // Add id to user
            given_name?: string | null;
            family_name?: string | null;
            name?: string | null;
            email?: string | null;
            image?: string | null;
        }
    }

}
interface User { // Ensure user is defined
    id?: string | null; // Add id to user
    username?: string | null; // Add id to user
    given_name?: string | null;
    family_name?: string | null;
    name?: string | null;
    email?: string | null;
    image?: string | null;
}
declare module "next-auth/jwt" {
    interface JWT {
        access_token?: string;
        sub?: string; // Zitadel uses 'sub' for user ID
    }
}

export const authOptions: NextAuthOptions = {
    // Secret for Next-auth, without this JWT encryption/decryption won't work
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        jwt: async ({ token, user, account }) => { // These parameters are typed by NextAuthOptions
            console.log("JWT Callback:", { token, user, account });
            // Store access_token directly on token
            if (account?.access_token) {
                token.access_token = account.access_token;
            }

            // If a user is provided (on first login), add their ID to the token
            if (user?.id) {
                token.sub = user.id; // Store the user ID from the user object on the token's 'sub' claim
            }


            return token;
        },
        session({ session, token, user }: { session: Session; token: JWT, user: User }) {
            console.log("Session Callback:", { session, token, user });
            // Copy access_token from token to session
            session.accessToken = token.access_token;
            if (token.sub) {
                session.user.id = token.sub;
            };
            if (session.user.name) {
                session.user.given_name = session.user.name?.split(' ')[0];
                session.user.family_name = session.user.name?.split(' ')[1];
            };

            return session;
        },
    },
    // Configure one or more authentication providers
    providers: [
        {
            id: "zitadel", // Unique identifier for the provider
            name: "Zitadel", // Name of the provider
            type: "oauth", // Provider type
            wellKnown: process.env.AUTH_OIDC_ISSUER + "/.well-known/openid-configuration",
            clientId: process.env.AUTH_OIDC_CLIENT_ID, // Client ID for authentication from environment variable
            clientSecret: process.env.AUTH_OIDC_CLIENT_SECRET, // Client Secret for authentication from environment variable
            authorization: {
                params: { scope: "openid email profile offline_access" },
            },
            profile(profile: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
                // Log essential information when a user logs in
                console.log("User logged in", { userId: profile.sub });
                console.log(profile);

                return {
                    id: profile.sub, // User ID from the profile
                    username: profile.sub?.toLowerCase(), // Username (converted to lowercase)
                    given_name: profile.given_name,
                    family_name: profile.family_name,
                    name: `${profile.given_name} ${profile.family_name}`, // Full name from given and family names
                    email: profile.email, // User email
                };
            },
        },
    ],
};
