import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export default async function middleware(request: NextRequest) {
  // Réponse source où Supabase va écrire les cookies
  const supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // Écrire uniquement sur la réponse (pas sur request.cookies)
          for (const cookie of cookiesToSet) {
            supabaseResponse.cookies.set(cookie);
          }
        },
      },
    }
  );

  // IMPORTANT: DO NOT REMOVE auth.getUser()
  const { data: { user } } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const method = request.method;

  // Helpers
  const withSupabaseCookies = (res: NextResponse) => {
    for (const c of supabaseResponse.cookies.getAll()) {
      res.cookies.set(c);
    }
    return res;
  };

  const isPublicPath =
    pathname === "/connexion" ||
    pathname === "/auth/callback";

  // Si c'est une requête "API-like" (non-GET) on évite les redirections
  const isApiLike = method !== "GET" || pathname.startsWith("/api");

  // Si user connecté et va sur /connexion => /dashboard
  if (user && pathname === "/connexion") {
    return withSupabaseCookies(
      NextResponse.redirect(new URL("/dashboard", request.url))
    );
  }

  // Si user NON connecté et route protégée
  if (!user && !isPublicPath) {
    if (isApiLike) {
      // IMPORTANT : ne pas rediriger les POST/PUT/etc.
      return withSupabaseCookies(
        NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      );
    }
    // GET classique => redirection vers /connexion
    return withSupabaseCookies(
      NextResponse.redirect(new URL("/connexion", request.url))
    );
  }

  // Laisser passer
  return supabaseResponse;
}

export const config = {
  matcher: [
    // tout sauf assets/images/favicon
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
