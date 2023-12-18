import { NextApiRequest, NextApiResponse } from "next";
import { createRedisInstance } from "./redis";
import { VerifyTokenErrors } from '@/types/user';
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import type { GetServerSidePropsContext } from 'next';

export const verifyToken = async ( req: NextApiRequest | GetServerSidePropsContext['req'], res: NextApiResponse | GetServerSidePropsContext['res']) => {
    const serverSession = await getServerSession(req, res, authOptions);
    
    if (!serverSession) {
        return getErrorMessage(VerifyTokenErrors.UNAUTHORIZED)
    }

    const { email, opaqueToken, tokenTimestamp } = { ...serverSession.user };
    const redis = createRedisInstance();

    let opaqueTokenExists = await redis.exists(email as string);

    // Exists for 10 minutes, so if not found the session has expired
    if (!opaqueTokenExists) {
        return {
            error: { code: 403, message: VerifyTokenErrors.SESSION_EXPIRED },
            email,
            opaqueToken
        }
    }

    let cachedOpaqueToken = await redis.get(email as string);
    
    if (cachedOpaqueToken) {
        cachedOpaqueToken = cachedOpaqueToken.replace(/^"|"$/g, '');
    }

    if (cachedOpaqueToken !== opaqueToken) {
        await redis.del(email as string)
        await redis.del(cachedOpaqueToken as string)
        return getErrorMessage(VerifyTokenErrors.TOKEN_MISMATCH)
    }

    return {
        cachedOpaqueToken,
        email,
        tokenTimestamp
    };
}

const getErrorMessage = (message: VerifyTokenErrors, code = 403,) => {
    return { 
        error: { 
            code,
            message
        }
    }
}