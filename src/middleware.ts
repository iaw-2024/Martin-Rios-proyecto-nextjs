import { withAuth } from "next-auth/middleware";
import { NextRequest } from "next/server";

export default withAuth({
    pages: {
      signIn: '/login',
      signOut: '/logout'
    },
    callbacks: {
        authorized: ({ req, token}:{req:NextRequest, token:any}) => {
            //TODO verificar bien el tema de la ruta, dentro del req estan las url
            //también verificar el tema de las paginas de compra y demás
            //console.log(req)

            console.log(token.role)
            return token.role == 'admin'
        }
    }
});

export const config = { matcher: ["/admin", "/login"] }