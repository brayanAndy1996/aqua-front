import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      email?: string | null;
      name?: string | null;
      username?: string;
      nombre?: string;
      apellido_paterno?: string;
      apellido_materno?: string;
      accessToken?: string;
    };
  }

  interface User {
    id?: string;
    email?: string | null;
    name?: string | null;
    username?: string;
    nombre?: string;
    apellido_paterno?: string;
    apellido_materno?: string;
    token?: string;
    user?: User;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    user?: User;
    exp?: number;
  }
}
