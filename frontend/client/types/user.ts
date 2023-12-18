import { JWT } from "next-auth/jwt";

export type VerifyTokenResult = {
    cachedOpaqueToken?: string | null;
    email?: string | null;
    opaqueToken?: string;
    error?: {
        code: number;
        message: string;
    }
}

export interface NextJWT extends JWT {
    user: JWT;
}

export enum VerifyTokenErrors {
    MISSING_TOKEN = 'Missing token',
    UNAUTHORIZED = 'Unauthorized',
    TOKEN_MISMATCH = 'Token mismatch.',
    SESSION_EXPIRED = 'Session expired'
}

export type JwtToken = {
    name: string;
    email: string;
    user: {
        opaqueToken: string;
        email: string;
        tokenTimestamp: number;
    }
}