import NextAuth, { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
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
    // สามารถตั้งค่า path หน้า custom login ได้เช่น signIn: '/login'
  }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
