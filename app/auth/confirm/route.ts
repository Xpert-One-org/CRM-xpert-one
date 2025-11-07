import { createSupabaseAppServerClient } from '@/utils/supabase/server';
import { type EmailOtpType } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import type { NextRequest} from 'next/server';
import { NextResponse } from 'next/server';
// The client you created from the Server-Side Auth instructions

export async function GET(request: NextRequest) {
  console.log('confirm route called');
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get('token_hash');
  const type = searchParams.get('type') as EmailOtpType | null;
  const next = searchParams.get('next') ?? '/';
  const redirectTo = request.nextUrl.clone();
  redirectTo.pathname = next;

  if (token_hash && type) {
    const supabase = await createSupabaseAppServerClient();

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });
    if (!error) {
      // erase url and recre
      return NextResponse.redirect(
        new URL('/nouveau-mot-de-passe', request.url)
      );
    }
  }

  // return the user to an error page with some instructions
  redirectTo.pathname = '/auth/auth-code-error';
  return NextResponse.redirect(redirectTo);
}
