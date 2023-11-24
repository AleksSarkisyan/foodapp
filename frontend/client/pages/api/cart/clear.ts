import { getToken } from "next-auth/jwt"
import { NextApiRequest, NextApiResponse } from "next";
import { createRedisInstance } from "../../../services/redis";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token: any = await getToken({ req });

  if (!token) {
    return res.status(403).json({ error: true, message: 'Missing token.' })
  }

  const redis = createRedisInstance();
  const email: string = token?.user.email;
  let cacheKey = `cart_user_${email}`;

  let userCartExists = await redis.exists(cacheKey);

  if (userCartExists) {
    redis.del(cacheKey);
    return res.status(200).json({ error: false, message: 'Cart deleted' })
  }

  return res.status(200).json({ error: false, message: 'Nothing to delete' })
}