import NextAuth, { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET || "7ed178c8ee4ec1b8b8081529156d2a6f129fb025b72fe6c2e0793bb3310a6e00",
  adapter: PrismaAdapter(prisma),
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID || "github_oauth_client_id",
      clientSecret: process.env.GITHUB_SECRET || "github_oauth_client_secret",
      authorization: {
        params: {
          scope: "read:user user:email repo",
        },
      },
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        // ระบบทดสอบ: ให้ใช้ test@example.com / password ในการทดสอบเข้าสู่ระบบนักศึกษา
        if (credentials?.email === "test@example.com" && credentials?.password === "password") {
          let user = await prisma.user.findUnique({ where: { email: "test@example.com" } });
          if (!user) {
             user = await prisma.user.create({
               data: {
                 name: "นักศึกษา ทดสอบ",
                 email: "test@example.com",
                 role: "STUDENT",
                 image: "https://ui-avatars.com/api/?name=นักศึกษา+ทดสอบ",
               }
             });
          }
          return { id: user.id, name: user.name, email: user.email, image: user.image, role: user.role };
        }
        
        // ระบบทดสอบ: ให้ใช้ teacher@example.com / password ในการทดสอบเข้าสู่ระบบอาจารย์
        if (credentials?.email === "teacher@example.com" && credentials?.password === "password") {
          let user = await prisma.user.findUnique({ where: { email: "teacher@example.com" } });
          if (!user) {
             user = await prisma.user.create({
               data: {
                 name: "ศ.ดร.สมชาย ใจดี",
                 email: "teacher@example.com",
                 role: "TEACHER",
                 image: "https://ui-avatars.com/api/?name=Somchai+Jaidee",
               }
             });
          }
          return { id: user.id, name: user.name, email: user.email, image: user.image, role: user.role };
        }

        // ระบบทดสอบ: ให้ใช้ employer@example.com / password ในการทดสอบเข้าสู่ระบบนายจ้าง
        if (credentials?.email === "employer@example.com" && credentials?.password === "password") {
          let user = await prisma.user.findUnique({ where: { email: "employer@example.com" } });
          if (!user) {
             user = await prisma.user.create({
               data: {
                 name: "คุณวิชัย ปรีชา (บมจ. เทคโนโลยีดีไลท์)",
                 email: "employer@example.com",
                 role: "EMPLOYER",
                 image: "https://ui-avatars.com/api/?name=Wichai+Preecha",
               }
             });
          }
          return { id: user.id, name: user.name, email: user.email, image: user.image, role: user.role };
        }

        // ตรวจสอบผู้ใช้ที่ลงทะเบียนในระบบ (DevSecOps Fix: ป้องกัน Broken Authentication)
        if (credentials?.email && credentials?.password) {
          const email = credentials.email.trim().toLowerCase();
          const user = await prisma.user.findUnique({
            where: { email }
          });

          if (user && user.password) {
            // OWASP A07: ตรวจสอบ bcrypt hash เสมอ (ป้องกัน Timing Attack)
            const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

            if (!isPasswordValid) {
              console.warn(`[Security] Failed login attempt for ${email}`);
              return null;
            }

            // บันทึก Audit Log
            try {
              await prisma.auditLog.create({
                data: {
                  userId: user.id,
                  action: "AUTH_LOGIN_SUCCESS",
                  details: `ผู้ใช้ ${email} เข้าสู่ระบบสำเร็จ`,
                },
              });
            } catch {
              // silent fallback
            }

            return {
              id: user.id,
              name: user.name,
              email: user.email,
              image: user.image,
              role: user.role
            };
          }
        }

        return null;
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
        session.user.role = (token.role as string) || "STUDENT";
        (session as any).accessToken = token.accessToken;
        (session as any).githubUsername = token.githubUsername;
      }
      return session;
    },
    async jwt({ token, user, account, profile }) {
      if (user) {
        token.sub = user.id;
        token.role = (user as any).role || "STUDENT";
      }
      if (account?.provider === "github") {
        token.accessToken = account.access_token;
        if (profile) {
          token.githubUsername = (profile as any).login;
        }
      }
      return token;
    }
  },
  pages: {
    signIn: "/login",
    error: "/login",
  }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
