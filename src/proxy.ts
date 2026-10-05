import { NextResponse, type NextRequest } from "next/server";
import { LOCALE_HEADER, splitLocale } from "@/i18n/config";
import { SESSION_COOKIE, verifySessionToken } from "@/server/auth/session";

/**
 * 1. Langues : /kab/... sert la même page en kabyle (réécriture interne + en-tête de langue).
 * 2. Administration : toute page /admin et toute API /api/admin exigent une session.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) return guardAdmin(request);

  const { locale, path } = splitLocale(pathname);
  if (locale !== "fr" && (path.startsWith("/admin") || path.startsWith("/api"))) {
    return NextResponse.redirect(new URL(path, request.url));
  }

  // L'en-tête est toujours réécrit : impossible de le forcer depuis le navigateur
  const headers = new Headers(request.headers);
  headers.set(LOCALE_HEADER, locale);

  if (locale === "fr") return NextResponse.next({ request: { headers } });
  const url = request.nextUrl.clone();
  url.pathname = path;
  return NextResponse.rewrite(url, { request: { headers } });
}

function guardAdmin(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname === "/admin/connexion") return NextResponse.next();

  const authenticated = verifySessionToken(request.cookies.get(SESSION_COOKIE)?.value);
  if (authenticated) return NextResponse.next();

  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }
  const url = new URL("/admin/connexion", request.url);
  if (pathname !== "/admin") url.searchParams.set("suite", pathname);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    // Tout sauf les fichiers techniques et statiques
    "/((?!_next/|media/|api/(?!admin)|robots\\.txt|sitemap\\.xml|icon\\.svg|apple-icon|opengraph-image|.*\\.[a-zA-Z0-9]+$).*)",
  ],
};
