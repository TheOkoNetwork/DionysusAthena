import { NextAuthOptions, Session } from "next-auth";
import { JWT } from "next-auth/jwt";
// You might need to import specific types for JWT callback parameters if not
// implicitly handled by NextAuthOptions typing.
// import { JWTCallbackParameters } from "next-auth/core/types";

/**
 * Extended error interface for token refresh errors
 */
interface TokenRefreshError extends Error {
    status?: number;
    responseBody?: unknown;
}

/**
 * Refreshes an OIDC access token using the refresh token
 */
async function refreshAccessToken(token: JWT): Promise<JWT> {
    try {
        // Use the OIDC standard token endpoint
        const url = process.env.AUTH_OIDC_ISSUER + "/oauth/v2/token";
        
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: new URLSearchParams({
                client_id: process.env.AUTH_OIDC_CLIENT_ID!,
                client_secret: process.env.AUTH_OIDC_CLIENT_SECRET!,
                grant_type: "refresh_token",
                refresh_token: token.refresh_token!,
            }),
        });

        const refreshedTokens = await response.json();

        if (!response.ok) {
            console.error("Failed to refresh access token:", refreshedTokens);
            const error: TokenRefreshError = new Error(
                `Failed to refresh access token: ${response.status} ${response.statusText} - ${JSON.stringify(refreshedTokens)}`
            );
            // Optionally attach more details for downstream error handling
            error.status = response.status;
            error.responseBody = refreshedTokens;
            throw error;
        }

        return {
            ...token,
            access_token: refreshedTokens.access_token,
            expires_at: Math.floor(Date.now() / 1000) + refreshedTokens.expires_in,
            refresh_token: refreshedTokens.refresh_token ?? token.refresh_token, // Fall back to old refresh token
        };
    } catch (error) {
        console.error("Error refreshing access token:", error);
        return {
            ...token,
            error: "RefreshAccessTokenError",
        };
    }
}

// Augment the NextAuth types to include accessToken in Session and access_token in JWT
declare module "next-auth" {
    interface Session {
        accessToken?: string;
        refreshToken?: string;
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
        refresh_token?: string;
        expires_at?: number; // Unix timestamp when access token expires
        sub?: string; // Zitadel uses 'sub' for user ID
        error?: string; // Error message if token refresh fails
    }
}

export const authOptions: NextAuthOptions = {
    // Secret for Next-auth, without this JWT encryption/decryption won't work
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        jwt: async ({ token, user, account }) => { // These parameters are typed by NextAuthOptions
            console.log("JWT Callback:", { token, user, account });
            
            // Store access_token and refresh_token on initial sign-in
            if (account?.access_token) {
                token.access_token = account.access_token;
                token.refresh_token = account.refresh_token;
                token.expires_at = account.expires_at;
            }

            // If a user is provided (on first login), add their ID to the token
            if (user?.id) {
                token.sub = user.id; // Store the user ID from the user object on the token's 'sub' claim
            }

            // Check if the access token has expired and refresh if needed
            if (token.expires_at && token.refresh_token) {
                const currentTime = Math.floor(Date.now() / 1000);
                // Refresh token 5 minutes before expiry to avoid race conditions
                const shouldRefresh = currentTime >= (token.expires_at - 300);
                
                if (shouldRefresh) {
                    console.log("Access token expired, refreshing...");
                    return await refreshAccessToken(token);
                }
            }

            return token;
        },
        session({ session, token }: { session: Session; token: JWT, user: User }) {
            console.log("Session Callback:", { session, token });
            // Copy access_token from token to session
            session.accessToken = token.access_token;
            session.refreshToken = token.refresh_token;

            if (token.expires_at) {
                session.expires = new Date(token.expires_at * 1000).toISOString();
            }
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
                params: { scope: "openid email profile offline_access"},
            },
            profile(profile: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
                // Log essential information when a user logs in
                // console.log("User logged in", { userId: profile.sub });
                // console.log(profile);

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
