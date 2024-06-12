import { sql } from '@vercel/postgres';
import type { User } from '@/app/lib/Entities';
import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { compare } from 'bcrypt';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import { RouteKind } from 'next/dist/server/future/route-kind';


async function getUser(email: string): Promise<User | undefined> {
  try {
    const user = await sql<User>`SELECT * FROM users WHERE email=${email}`;
    return user.rows[0];
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}

export const authOptions:NextAuthOptions={
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
    signOut: '/logout'
  },
  providers: [
    CredentialsProvider({
      credentials: {
          email: {},
          password: {},
      },
      async authorize(credentials, req) {
        //
          const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

          if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;

          const user = await getUser(email);
          if (!user) return null;

          const passwordsMatch = await bcrypt.compare(password, user.password);
          console.log(user)
          if (passwordsMatch) 
              return {
              id: user.id,
              email: user.email,
              role: user.role
          };
          }
          return null;
      },
    }),
  ],
  callbacks:{
    async redirect({url, baseUrl}){
      console.log("url")
      return baseUrl
    },
    async session({ session, token, user }:any) {
      session.user.role = token.role
      session.user.id = token.id
      console.log("invocacndo a la sesion del lado del servidor")
      return session;
    },
    async jwt({token, user}) {
      if(user){
        token.id = user.id
        token.role = user.role
      }
      return token
    },
  }
}

const handler = NextAuth(authOptions);
  
export { handler as GET, handler as POST };