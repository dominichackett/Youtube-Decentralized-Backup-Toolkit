// eslint-disable-next-line @next/next/no-server-import-in-page
import { NextResponse } from 'next/server'
// eslint-disable-next-line @next/next/no-server-import-in-page
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers)
console.log(request)
  if (request.nextUrl.pathname.includes("mint") )//.startsWith('/mint')) 
  {
    pub()
  const response = NextResponse.next({
    request: {
      // New request headers
      headers: requestHeaders,
    },
  })
  //response.headers.set('Cross-Origin-Embedder-Policy', 'require-corp')
  //response.headers.set('Cross-Origin-Opener-Policy', 'same-origin')
  response.headers.set("Cross-Origin-Opener-Policy", "same-origin")
  response.headers.set("Cross-Origin-Embedder-Policy", "require-corp")
  response.headers.set("Cross-Origin-Resource-Policy","cross-origin")
  //response.headers.delete("Cross-Origin-Embedder-Policy")
  return response
  //   }
}
}
