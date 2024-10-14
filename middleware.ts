import { type NextRequest, NextResponse } from "next/server";
import { createSupabaseAppServerClient } from "@/utils/supabase/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const res = NextResponse.next();
  const supabase = createSupabaseAppServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user && pathname === '/connexion') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  if (!user && pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/connexion', request.url));
  }

  return res;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
