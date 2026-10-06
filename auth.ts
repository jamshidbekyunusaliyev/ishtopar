import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { allowAttempt } from "@/lib/rate-limit";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, request) {
        const email = String(credentials.email ?? "").trim().toLowerCase();
        const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
        if (!allowAttempt(`login:${ip}`, 10, 15 * 60 * 1000)) return null;
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || user.blockedAt || !(await bcrypt.compare(String(credentials.password ?? ""), user.passwordHash))) return null;
        return { id: user.id, name: user.name, email: user.email, role: user.role };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = String(token.id ?? token.sub);
        if (token.role === "SEEKER" || token.role === "EMPLOYER" || token.role === "ADMIN") {
          session.user.role = token.role;
        }
      }
      return session;
    },
    authorized({ auth: session, request }) {
      const path = request.nextUrl.pathname;
      const protectedPath = ["/employer", "/seeker", "/messages", "/admin", "/api/employer", "/api/seeker", "/api/messages", "/api/admin"]
        .some((prefix) => path === prefix || path.startsWith(`${prefix}/`));
      if (!protectedPath) return true;
      if (!session?.user) return false;
      if ((path.startsWith("/employer") || path.startsWith("/api/employer")) && session.user.role !== "EMPLOYER") {
        return Response.redirect(new URL("/seeker/dashboard", request.url));
      }
      if ((path.startsWith("/seeker") || path.startsWith("/api/seeker")) && session.user.role !== "SEEKER") {
        return Response.redirect(new URL("/employer/dashboard", request.url));
      }
      if ((path.startsWith("/admin") || path.startsWith("/api/admin")) && session.user.role !== "ADMIN") {
        return Response.redirect(new URL("/", request.url));
      }
      return true;
    },
  },
});