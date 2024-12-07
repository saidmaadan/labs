import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

import Resend from "next-auth/providers/resend";
import { prisma } from "@/lib/prisma";

// const resend = new Resend(process.env.RESEND_API_KEY)


export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/signin",
    verifyRequest: "/auth/verify",
  },
  providers: [
    Resend({
      apiKey: process.env.RESEND_API_KEY,
      from: "onboarding@resend.dev",
      fromName: "Your App Name",
      // Customize email template
      emailTemplate: ({ url, host, provider }) => ({
        subject: `Sign in to ${host}`,
        html: `
          <body>
            <h1>Sign in to ${host}</h1>
            <p>Click the link below to sign in to your account:</p>
            <a href="${url}">Sign in</a>
          </body>
        `,
      }),
    }),
    //   server: process.env.EMAIL_SERVER,
    //   from: process.env.EMAIL_FROM,
    //   async sendVerificationRequest({
    //     identifier: email,
    //     url,
    //     provider: { server, from },
    //   }) {
    //     try {
    //       await resend.emails.send({
    //         from: provider.server.from,
    //         to: identifier,
    //         subject: "Sign in to Your App",
    //         html: `<p>Click <a href="${url}">here</a> to sign in to your account.</p>`
    //       })
    //     } catch (error) {
    //       console.error("Error sending verification email", error)
    //       throw new Error("Error sending verification email")
    //     }
    //   }
    // }),
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],
  callbacks: {
    async session({ token, session }) {
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.picture;
        session.user.role = token.role;
      }

      return session;
    },
    async jwt({ token, user }) {
      if (!token.email) return token;

      if (user) {
        token.id = user.id;
        token.role = user.role;
      }

      return token;
    },
  },
});
