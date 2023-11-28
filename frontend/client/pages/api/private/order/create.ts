import { httpClientApi } from "@/services/httpClientApi";
import { NextApiRequest, NextApiResponse } from "next";
import { AddToCartParams } from "@/types/cart";
import { createRedisInstance } from "@/services/redis";
import { verifyToken } from "@/services/verifyToken";
import { VerifyTokenResult } from '@/types/user';

/** Actual order creation */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { cachedOpaqueToken, email, error } = await verifyToken(req, res) as VerifyTokenResult;

    if (error?.code) {
        return res.status(error.code).json({ error: true, message: error.message })
    }
    
    const redis = createRedisInstance();

    const parsedBody = JSON.parse(req.body);
    const { restaurantId } = parsedBody

    if (!restaurantId) {
        return res.status(404).json({ error: true, message: 'Missing restaurantId' })
    }

    let cacheKey = `cart_user_${email}`;

    let userCartExists = await redis.exists(cacheKey);

    if (!userCartExists) {
        return res.status(404).json({ error: true, message: 'Cart is empty' })
    }

    let cartProductsString = await redis.get(cacheKey);
    let currentCart: AddToCartParams[] = JSON.parse(cartProductsString as string);

    const products = currentCart.map(({ price, name, weight, ...requiredParams }) => requiredParams);

    let createOrderParams = JSON.stringify({
        products,
        restaurantId
    });

    let apiResult = await httpClientApi({
        method: 'POST',
        token: cachedOpaqueToken,
        path: 'order/create',
        params: createOrderParams
    })

    let { stripeRedirectUrl } = apiResult;

    if (stripeRedirectUrl) {
        return res.status(201).json({ stripeRedirectUrl });
    }

    return res.status(404).json({ error: true, message: 'Error creating order.' })
}