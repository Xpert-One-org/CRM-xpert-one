// middleware.ts
import { createSupabaseAppServerClient } from "@/utils/supabase/server";
import { NextResponse, type NextRequest } from "next/server";

const PUBLIC_PATHS = ["/connexion", "/auth/callback"];

function normalizePath(pathname: string) {
  // retire un éventuel locale au début (fr, en, etc.)
  const withoutLocale = pathname.replace(/^\/([a-zA-Z-]{2,})(?=\/|$)/, "");
  // retire le slash final sauf pour la racine
  const normalized = withoutLocale !== "/" ? withoutLocale.replace(/\/$/, "") : "/";
  // vide => racine
  return normalized || "/";
}

export async function middleware(request: NextRequest) {
  const res = NextResponse.next();

  // Important en middleware: passer req/res au client
  const supabase = await createSupabaseAppServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = normalizePath(request.nextUrl.pathname);

  // Utilisateur connecté sur la page /connexion → bascule vers /dashboard
  if (user && path === "/connexion") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Autoriser les routes publiques si non connecté
  const isPublic = PUBLIC_PATHS.some((p) => path === p || path.startsWith(`${p}/`));
  if (!user && !isPublic) {
    const url = new URL("/connexion", request.url);
    // optionnel: mémoriser la page d’origine pour y revenir après login
    url.searchParams.set("redirectedFrom", request.nextUrl.pathname + request.nextUrl.search);
    return NextResponse.redirect(url);
  }

  return res;
}

export const config = {
  matcher: [
    // tout sauf assets/images/favicon
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
