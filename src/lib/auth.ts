import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { oAuthProxy } from "better-auth/plugins";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql", 
  }),
  user: {
    additionalFields:{
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

  baseURL: process.env.FRONTEND_URL,
  trustedOrigins: [process.env.FRONTEND_URL!],

  // ========================== Email and Password ==========================
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },

  // ========================== Social Providers ==========================
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      prompt: "select_account",
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
  },

  // account: { skipStateCookieCheck: true }, // solved redirect issue
  advanced: {
    cookies: {
      session_token: {
        name: "session_token", // Force this exact name
        attributes: {
          httpOnly: true,
          secure: true,
          sameSite: "none",
          partitioned: true,
        },
      },
      state: {
        name: "session_token", // Force this exact name
        attributes: {
          httpOnly: true,
          secure: true,
          sameSite: "none",
          partitioned: true,
        },
      },
    },
  },

  plugins: [oAuthProxy()],
});
