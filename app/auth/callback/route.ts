import { createSupabaseAppServerClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  console.log(request.url);
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next') || '/';
  const origin = process.env.NEXT_PUBLIC_SITE_URL;

  if (code) {
    const supabase = await createSupabaseAppServerClient();
    await supabase.auth.exchangeCodeForSession(code);
  }

  // Utilise le paramètre 'next' pour la redirection si présent
  console.log(`http://localhost:3000${next}`);
  return NextResponse.redirect(`${origin}${next}`);
}
