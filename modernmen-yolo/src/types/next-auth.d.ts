declare module 'next-auth' {
  export function getServerSession(...args: any[]): any;
  export interface NextAuthOptions {
    providers: any[];
    adapter?: any;
    secret?: string;
    session?: any;
    callbacks?: any;
    events?: any;
    pages?: any;
  }
  
  export interface User {
    id: string;
    name?: string;
    email?: string;
    image?: string;
    role?: string;
  }
  
  export interface Session {
    user: User;
    accessToken?: string;
  }
  
  export interface JWT {
    sub?: string;
    role?: string;
    accessToken?: string;
  }
}
