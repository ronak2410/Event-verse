import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  // Generate random base64 nonce using Web Crypto API
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");

  // Construct rigorous CSP using nonce and strict-dynamic for script execution
  // In development, Next.js hot-reload and fast-refresh need eval; in production, keep strict.
  const isDev = process.env.NODE_ENV === "development";
  const scriptSrc = isDev
    ? `'self' 'unsafe-eval' 'nonce-${nonce}'`
    : `'self' 'nonce-${nonce}' 'strict-dynamic'`;

  const cspHeader = `
    default-src 'self';
    script-src ${scriptSrc};
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    font-src 'self' https://fonts.gstatic.com data:;
    img-src 'self' data: https: blob:;
    connect-src 'self' https://generativelanguage.googleapis.com;
    frame-ancestors 'none';
    base-uri 'self';
    form-action 'self';
  `.replace(/\s{2,}/g, " ").trim();

  // Set request headers so Server Components / Next.js can read the nonce
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", cspHeader);

  // Set response headers
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  response.headers.set("Content-Security-Policy", cspHeader);
  response.headers.set("x-nonce", nonce);

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - api routes
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon)
     */
    {
      source: "/((?!api|_next/static|_next/image|favicon.ico).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
