// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  name: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const options = {
    method: 'POST',
    body: JSON.stringify({
      email: 'webi.aleks2@gmail.com',
      password: 'test123'
    }),
    headers: {
      "Content-Type": "application/json"
    },
  }
  const response = await fetch(`${process.env.HTTP_RESTAURANT_API_URL}user/login`, options);
  const result = await response.json();

  return res.status(200).json(result)
}
