import { getToken } from "next-auth/jwt"
import { httpClientApi } from "../../services/httpClientApi"
import { NextApiRequest, NextApiResponse } from "next";

const secret = process.env.NEXTAUTH_SECRET

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const token: any = await getToken({ req })

    if (!token) {
        return res.status(403).json({ error: true, message: 'Missing token.' })
    }

    const accessToken = token.user.token.accessToken;

    let apiResult = await httpClientApi({
        method: 'POST',
        token: accessToken,
        path: 'order/create',
        params: req.body
    })

    return res.status(403).json({ apiResult });
}