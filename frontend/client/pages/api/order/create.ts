import { getToken } from "next-auth/jwt"
import { httpClientApi } from "../../../services/httpClientApi";
import { createRedisInstance } from "../../../services/redis";
import { NextApiRequest, NextApiResponse } from "next";
import { AddToCartParams } from "../../../types/cart";

/** Actual order creation */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const token: any = await getToken({ req })

    if (!token) {
        return res.status(403).json({ error: true, message: 'Missing token.' })
    }

    const parsedBody = JSON.parse(req.body);
    const { restaurantId } = parsedBody

    if (!restaurantId) {
        return res.status(404).json({ error: true, message: 'Missing restaurantId' })
    }

    const accessToken = token.user.token.accessToken;
    const email: string = token?.user.user.email;
    const redis = createRedisInstance();
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
        token: accessToken,
        path: 'order/create',
        params: createOrderParams
    })

    let { stripeRedirectUrl } = apiResult;

    if (stripeRedirectUrl) {
        return res.status(201).json({ stripeRedirectUrl });
    }

    return res.status(404).json({ error: true, message: 'Error creating order.' })
}