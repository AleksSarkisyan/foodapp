import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";


const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  useSecureCookies: false,
  providers: [
    CredentialsProvider({
      type: "credentials",
      credentials: {},

      async authorize(credentials, req) {
        const { email, password } = credentials as {
          email: string;
          password: string;
        };

        const body = JSON.stringify({
          email: 'webi.aleks@gmail.com',
          password: 'test123'
        });
        const headers = {
          "Content-Type": "application/json"
        }

        const method = 'POST'
        let getToken = await fetch('http://localhost:3001/api/v1/user/login', { body, headers, method });
        const getTokenResult = await getToken.json();

        console.log('getTokenResult is', getTokenResult)

        if (!getTokenResult || getTokenResult.error) {
          throw new Error("invalid credentials");
        }

        return getTokenResult;
      }
    }),
  ],
  //secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/auth/signin"
  },
  callbacks: {
    async jwt({ token, user, account, profile }) {
      user && (token.user = user)
      return token
    },
    session({ session, user, token }: any) {
      session.user = token.user.user;
      return session
    },
  },
  debug: process.env.NODE_ENV === 'development',
};

export default NextAuth(authOptions);
