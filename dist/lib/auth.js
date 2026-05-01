import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma.js";
import { oAuthProxy } from "better-auth/plugins";
export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    user: {
        additionalFields: {
            password: {
                type: "string",
                required: false,
            },
            role: {
                type: "string",
                defaultValue: "USER",
                input: false,
            },
        }
    },
    baseURL: process.env.BETTER_AUTH_URL || `http://localhost:${process.env.PORT || 5000}`,
    trustedOrigins: [process.env.FRONTEND_URL],
    // ========================== Email and Password ==========================
    emailAndPassword: {
        enabled: true,
        autoSignIn: true,
    },
    // ========================== Social Providers ==========================
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            prompt: "select_account",
        },
        github: {
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
        },
    },
    // account: { skipStateCookieCheck: true }, // solved redirect issue
    advanced: {
        cookies: {
            session_token: {
                name: "session_token", // Force this exact name
                attributes: {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production" ? true : false,
                    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
                    partitioned: process.env.NODE_ENV === "production" ? true : false,
                },
            },
            state: {
                name: "state", // Better Auth state token
                attributes: {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production" ? true : false,
                    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
                    partitioned: process.env.NODE_ENV === "production" ? true : false,
                },
            },
        },
    },
    plugins: [oAuthProxy()],
});
//# sourceMappingURL=auth.js.map