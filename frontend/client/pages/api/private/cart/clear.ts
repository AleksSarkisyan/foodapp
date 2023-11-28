import { NextApiRequest, NextApiResponse } from "next";
import { createRedisInstance } from "@/services/redis";
import { verifyToken } from "@/services/verifyToken";
import { VerifyTokenResult } from '@/types/user';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { email, error } = await verifyToken(req, res) as VerifyTokenResult;
        
  if (error?.code) {
    return res.status(error.code).json({ error: true, message: error.message })
  }

  const redis = createRedisInstance();

  let cacheKey = `cart_user_${email}`;
  let userCartExists = await redis.exists(cacheKey);

  if (userCartExists) {
    redis.del(cacheKey);
    return res.status(200).json({ error: false, message: 'Cart deleted' })
  }

  return res.status(200).json({ error: false, message: 'Nothing to delete' })
}