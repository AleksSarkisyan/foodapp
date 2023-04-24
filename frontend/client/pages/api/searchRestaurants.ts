import { getToken } from "next-auth/jwt"
import { httpClientApi } from "../../services/httpClientApi"
import { NextApiRequest, NextApiResponse } from "next";


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    let apiResult = await httpClientApi({
        method: 'POST',
        token: null,
        path: 'restaurant/client-search',
        params: req.body
    })

    return res.status(200).json({ apiResult });
}