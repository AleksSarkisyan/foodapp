// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { body, method } = req
  let { token, products, restaurantId } = JSON.parse(body);

  const options = {
    method,
    body: JSON.stringify({ products, restaurantId }),
    headers: {
      "Content-Type": "application/json",
      "Authorization": `${token}`
    },
  }

  let createOrder = await fetch('http://localhost:3001/api/v1/order/create', options)
  const createOrderResult = await createOrder.json();
  const redirectUrl = createOrderResult.stripeRedirectUrl

  return res.status(200).json(redirectUrl)
}
