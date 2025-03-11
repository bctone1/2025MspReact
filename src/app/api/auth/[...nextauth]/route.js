import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";

export const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
          // const res = await axios.post("http://bctone.ddns.net:5000/login", {
            email: credentials.email,
            password: credentials.password,
          });
          
          if (res.status === 200) {
            return {
              id: res.data.id,
              name: res.data.name,
              email: res.data.email,
              message: res.data.message,
              role: res.data.role,
            };
          }
          return null;
        } catch (error) {
          console.error("에러 발생:", error);
          throw new Error("Invalid credentials");
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account.provider === "google") {
        try {
          // Google 로그인 성공 후 백엔드로 사용자 정보 전송
          await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/googlelogin`, {
            email: user.email,
            name: user.name,
            image: user.image,
          });
        } catch (error) {
          console.error("Google 로그인 후 백엔드 전송 실패:", error);
          return false; // 로그인 중단
        }
      }
      return true; // 로그인 계속 진행
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.message = user.message;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.email = token.email;
      session.user.message = token.message;
      session.user.role = token.role;
      return session;
    },
  },
});

export { handler as GET, handler as POST };
