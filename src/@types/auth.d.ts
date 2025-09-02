declare namespace Auth {
  interface AuthState {
   name: string;
   email: string;
   password: string;
   confirmPassword: string;
   token: string;
   refreshToken: string;
   role: string;
   avatar: string;
   createdAt: string;
   updatedAt: string;
  }
}