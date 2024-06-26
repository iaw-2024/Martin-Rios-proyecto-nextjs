import { DefaultSession, DefaultUser } from "next-auth"
import { JWT, DefaultJWT } from "next-auth/jwt"
import { Session } from "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            id: string,
            role: string,
        } & DefaultSession
    }

    interface User extends DefaultUser {
        id: string,
        role: string,
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        user: {
          id: string;
          role: string
        } & DefaultSession["user"];
    }
}