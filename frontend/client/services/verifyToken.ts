import { getToken, } from "next-auth/jwt";
import { NextApiRequest, NextApiResponse } from "next";
import { createRedisInstance } from "./redis";
import { VerifyTokenResult } from '../types/user';

export const verifyToken = async ( req: NextApiRequest, res: NextApiResponse) => {
    const token: any = await getToken({ req })

    if (!token) {
        return res.status(403).json({ error: true, message: 'Missing token.' })
    }

    const { email, opaqueToken } = token.user;

    const redis = createRedisInstance();

    let opaqueTokenExists = await redis.exists(email);

    if (!opaqueTokenExists) {
        return res.status(403).json({ error: true, message: 'Unauthorized.' })
    }

    let cachedOpaqueToken = await redis.get(email);
    
    if (cachedOpaqueToken) {
        cachedOpaqueToken = cachedOpaqueToken.replace(/^"|"$/g, '');
    }

    if (cachedOpaqueToken !== opaqueToken) {
        return res.status(403).json({ error: true, message: 'Token mismatch.' })
    }

    return {
        cachedOpaqueToken,
        email
    } as VerifyTokenResult;
}