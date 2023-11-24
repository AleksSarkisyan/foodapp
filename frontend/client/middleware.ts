import { NextRequest, NextResponse } from "next/server";
import { getToken, } from "next-auth/jwt";
import { createRedisInstance } from "./services/redis";

export async function middleware(req: NextRequest, res: NextResponse) {

  const privateApiRoutes = '/api/private/';
  if (req.nextUrl.pathname.startsWith(privateApiRoutes)) {
    
    // const token: any = await getToken({ req })
    
    // if (!token) {
    //   return NextResponse.json({ error: true, message: 'Missing token.' }, { status: 403 })
    // }

    // const { email, opaqueToken } = token.user;

    /** Looks like Next middleware does not have access to env values in the runtime
     *  https://github.com/redis/ioredis/issues/769
     */
    // try {
    //   const redis = createRedisInstance();
    // } catch (error) {
    //   console.log('error is', error)
    // }


   return NextResponse.next();
  }
}

export const config = {
    matcher: ['/api/private/:path*']
};
