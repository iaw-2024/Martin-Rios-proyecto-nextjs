import { withAuth } from "next-auth/middleware";

export default withAuth({
    pages: {
      signIn: '/login',
      signOut: '/logout'
    },
    callbacks: {
        authorized: ({ req, token }) => {
            //TODO verificar bien el tema de la ruta, dentro del req estan las url
            //también verificar el tema de las paginas de compra y demás
            //console.log(req)

            return token?.user.role != 'admin'
        }
    }
});

export const config = { matcher: ["/admin", "/login"] }