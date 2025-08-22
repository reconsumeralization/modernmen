import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role?: string
      name?: string | null
      email?: string | null
      image?: string | null
    }
    accessToken?: string
  }

  interface User {
    id: string
    role?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    sub: string
    role?: string
    accessToken?: string
  }
}