import { NextResponse, type NextRequest } from "next/server";

import { decideLocale } from "@/shared/i18n/decide-locale";
import { localeCookie } from "@/shared/i18n/locales";

const ONE_YEAR = 60 * 60 * 24 * 365;

/** Locale routing: every decision is made by `decideLocale`. */
export function proxy(request: NextRequest) {
  const decision = decideLocale({
    pathname: request.nextUrl.pathname,
    search: request.nextUrl.search,
    cookie: request.cookies.get(localeCookie)?.value,
    acceptLanguage: request.headers.get("accept-language"),
  });

  if ("redirect" in decision) {
    return NextResponse.redirect(new URL(decision.redirect, request.url), 307);
  }

  const response = NextResponse.next();
  if (decision.setCookie) {
    response.cookies.set(localeCookie, decision.setCookie, {
      path: "/",
      maxAge: ONE_YEAR,
      sameSite: "lax",
    });
  }
  return response;
}

export const config = {
  // Everything but Next's internals and files with an extension (`/icon.png`,
  // `/robots.txt`); those never carry a locale.
  matcher: ["/((?!_next/|.*\\.[^/]*$).*)"],
};
