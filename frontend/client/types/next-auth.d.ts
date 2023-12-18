import { DefaultUser } from 'next-auth';
declare module 'next-auth' {
    interface Session {
        user?: DefaultUser & { id: string; role: string, token: string, email: string; opaqueToken: string, tokenTimestamp: number };
    }
    interface User extends DefaultUser {
        role: string;
        token: string;
    }
}