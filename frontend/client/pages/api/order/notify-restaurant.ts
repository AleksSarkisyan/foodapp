import { getToken } from "next-auth/jwt"
import { httpClientApi } from "../../../services/httpClientApi";
import { NextApiRequest, NextApiResponse } from "next";

/** Get last user order with product details. Update order status */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const token: any = await getToken({ req })

    if (!token) {
        return res.status(403).json({ error: true, message: 'Missing token.' })
    }

    const accessToken = token.user.token.accessToken;

    let apiResult = await httpClientApi({
        method: 'POST',
        token: accessToken,
        path: 'order/notify-restaurant',
        params: ''
    })

    if (!apiResult || apiResult.success == false) {
        return res.status(404).json({ error: true, message: 'Error tracking order' })
    }

    let { order, orderDetails } = apiResult;

    return res.status(201).json({ order, orderDetails })
}