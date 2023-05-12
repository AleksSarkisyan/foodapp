import { getToken } from "next-auth/jwt"
import { NextApiRequest, NextApiResponse } from "next";
import { AddToCartParams } from "../../../types/cart";
import { createRedisInstance } from "../../../services/redis";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const token: any = await getToken({ req });

    if (!token) {
        return res.status(403).json({ error: true, message: 'Missing token.' })
    }

    const email: string = token?.user.user.email;
    let cacheKey = `cart_user_${email}`;

    const addToCartParams: AddToCartParams = JSON.parse(req.body);

    if (!addToCartParams.quantity || !addToCartParams.productId) {
        return res.status(404).json({ error: true, message: 'Missing params.' })
    }

    const redis = createRedisInstance();
    let userCartExists = await redis.exists(cacheKey);

    if (userCartExists) {
        let currentCartString = await redis.get(cacheKey);
        let currentCartJson: AddToCartParams[] = JSON.parse(currentCartString as string);
        let addedProduct: AddToCartParams | null = null;

        /** Check if we already have the product */
        currentCartJson.find(({ ...item }) => {
            if (item.productId == addToCartParams.productId) {
                addedProduct = item
            }
        })

        /** Add it */
        if (!addedProduct) {
            currentCartJson.push(addToCartParams);
            await redis.set(cacheKey, JSON.stringify(currentCartJson));
        } else {
            /** Product already added, just increatse its quantity */
            currentCartJson.map((product: AddToCartParams, key: number) => {
                if (product.productId == addToCartParams.productId) {
                    currentCartJson[key].quantity = currentCartJson[key].quantity + 1;

                }
            })
            await redis.set(cacheKey, JSON.stringify(currentCartJson));
        }
    } else {
        await redis.set(cacheKey, JSON.stringify([addToCartParams]));
    }

    let products = await redis.get(cacheKey);

    return res.status(201).json({ success: true, products });
}