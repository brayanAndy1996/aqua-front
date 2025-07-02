export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  name: string;
  phone: string;
}

export interface LoginResponse {
  user: User;
  message: string;
  token: string;
}

export interface User {
  id: string;
  email: string;
  username: string;
}

// NextAuth types
export interface NextAuthUser {
  id: string;
  email: string;
}

export interface NextAuthSession {
  user: NextAuthUser;
  accessToken: string;
  expires: string;
}
