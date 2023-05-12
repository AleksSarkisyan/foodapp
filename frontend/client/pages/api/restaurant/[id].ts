import { httpClientApi } from "../../../services/httpClientApi"
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    let restaurantId = req.query.id;

    let apiResult = await httpClientApi({
        method: 'GET',
        token: null,
        path: `menu/${restaurantId}`,
    })

    return res.status(200).json(apiResult);
}