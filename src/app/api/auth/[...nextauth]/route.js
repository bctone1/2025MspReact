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
          const res = await axios.post("http://127.0.0.1:5000/login", {
            email: credentials.email,
            password: credentials.password,
          });
          
          if (res.status === 200) {
            console.log(res.data);
            return {
              name: res.data.name,
              email: res.data.email,
              message: res.data.message,
              role: res.data.role,
            };
          }
          return null;
        } catch (error) {
          console.error("에러 발생:", error);  // 에러 출력
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
    async jwt({ token, user }) {
      // 로그인 성공 후 user 객체가 존재하면 token에 추가
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.message = user.message;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      // 세션에 JWT 토큰 정보 추가
      session.user.id = token.id;
      session.user.email = token.email;
      session.user.message = token.message;
      session.user.role = token.role;
      return session;
    },
  },
});

export { handler as GET, handler as POST };
