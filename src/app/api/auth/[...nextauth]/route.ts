/* eslint-disable @typescript-eslint/no-explicit-any */
// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { AuthOptions } from "next-auth";
import { authApi } from "@/apis/auth";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "ejemplo@email.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials): Promise<any> {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email y contraseña son requeridos");
        }
        
        try {
          const response = await authApi.login({
            email: credentials.email, 
            password: credentials.password
          });

          if (!response.token) {
            throw new Error("No se recibió un token válido");
          }

          return {
            token: response.token,
            user: response.user,
          }

        } catch (error: any) {
          console.error("Error en autenticación:", error);
          
          if (error.response?.status === 401) {
            throw new Error("Credenciales incorrectas");
          }
          if (error.response?.status === 404) {
            throw new Error("Usuario no encontrado");
          }
          
          throw new Error(error.message || "Error en la autenticación");
        }
      },
    })
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.accessToken = user.token;
        token.user = user.user;
      }
      return token;
    },
    async session({ session, token }: any) {
      session.user = {
        ...session.user,
        ...token.user,
        accessToken: token.accessToken,
      };
      return session;
    },
  }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

