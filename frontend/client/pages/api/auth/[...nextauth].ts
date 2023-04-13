import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";


const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  useSecureCookies: process.env.NODE_ENV != 'development' ? true : false,
  providers: [
    CredentialsProvider({
      type: "credentials",
      credentials: {},

      async authorize(credentials, req) {
        console.log('got credentials', credentials)
        const { email, password } = credentials as {
          email: string;
          password: string;
        };
        // perform you login logic
        // find out user from db

        const body = JSON.stringify({
          email,
          password
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

        return getTokenResult.user;
      }
    }),
  ],
  secret: process.env.JWT_SECRET,
  pages: {
    signIn: "/auth/signin",
    // error: '/auth/error',
    // signOut: '/auth/signout'
  },
  callbacks: {
    jwt(params) {
      console.log('params is', params)

      if (params.user?.role) {
        params.token.role = params.user.role;
      }

      // return final_token
      return params.token;
    },
    session({ session, token }) {
      console.log('session is', session)
      console.log('token is', token)
      return { ...session };
    },
  },
  debug: process.env.NODE_ENV === 'development',
};

export default NextAuth(authOptions);
