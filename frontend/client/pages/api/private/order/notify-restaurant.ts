import { httpClientApi } from "../../../../services/httpClientApi";
import { NextApiRequest, NextApiResponse } from "next";
import { verifyToken } from "../../../../services/verifyToken";
import { VerifyTokenResult } from '../../../../types/user';

/** Get last user order with product details. Update order status */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { cachedOpaqueToken } = await verifyToken(req, res) as VerifyTokenResult;

    let apiResult = await httpClientApi({
        method: 'POST',
        token: cachedOpaqueToken,
        path: 'order/notify-restaurant',
        params: ''
    })

    if (!apiResult || apiResult.success == false) {
        return res.status(404).json({ error: true, message: 'Error tracking order' })
    }

    let { order, orderDetails } = apiResult;

    return res.status(201).json({ order, orderDetails })
}