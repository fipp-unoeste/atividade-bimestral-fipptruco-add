import { NextResponse } from 'next/server'
 
export function middleware(request) {
    //consultar as cookies
    if(!request.cookies.get("token"))
        return NextResponse.redirect(new URL('/login', request.url))
}
 
export const config = {
//   matcher: ['/admin/:path*', '/locatario/:path*'],
    matcher: ['/salas/:path*'],
}