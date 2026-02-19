import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  if (process.env.DEBUG_ACTION_HEADERS === 'true' && request.method === 'POST') {
    const nextAction = request.headers.get('next-action');

    // Server Action requests should carry the next-action header. If missing,
    // this helps diagnose proxy/header forwarding problems.
    if (nextAction || request.nextUrl.pathname.startsWith('/group')) {
      console.info('[debug-action-headers]', {
        path: request.nextUrl.pathname,
        method: request.method,
        hasNextAction: Boolean(nextAction),
        nextAction: nextAction ?? null,
        origin: request.headers.get('origin'),
        host: request.headers.get('host'),
        xForwardedHost: request.headers.get('x-forwarded-host'),
        xForwardedProto: request.headers.get('x-forwarded-proto'),
        xForwardedFor: request.headers.get('x-forwarded-for'),
        xForwardedPort: request.headers.get('x-forwarded-port'),
      });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
